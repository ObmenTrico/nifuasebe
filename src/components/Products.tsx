import React, { FC, useEffect, useState } from "react";
import {Button, Card, Spin} from "antd";
import axios from "axios";
import { config } from "../config";
import "./Products.css"
import {MainButton, MainButtonProps, useShowPopup} from "@vkruglikov/react-telegram-web-app";

interface Product {
    id: number;
    img: any;
    title: string;
    description: string;
    price: number;
}

const Products: FC = () => {
    const showPopup = useShowPopup();

    // Костыль
    const [lockSend, setLockSend] = useState(true);

    const [loaded, setLoaded] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [tokenOk, setTokenOk] = useState(true);
    const [cart, setCart] = useState<{ id: number; tittle: string; price: number }[]>([]);
    const _params = new URLSearchParams(window.location.search);
    const id = _params.get("id");
    const token = _params.get("token");

    const sendData = () => {
        axios.post(
            config.apiEndpoint + '/cart/order',
            {id: id, token: token
            }).then(async () =>{
                await showPopup({
                    message: 'Заказ принят',
                })
                setCart([])
            }).catch(async (r: any) => {
                await showPopup({
                    message: 'Ошибка',
                })
        })
    }

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price, 0)
    }

    const handleToCart = (productId: number, tittle: string, productPrice: number) => {
        const isProductInCart = cart.some((item) => item.id === productId);

        if (!isProductInCart) {
            setCart([...cart, { id: productId, tittle: tittle, price: productPrice }])
        } else {
            const updatedCart = cart.filter((item) => item.id !== productId)
            setCart(updatedCart)
        }
    }

    useEffect(() => {
        if (lockSend)
            return
        axios
            .post(config.apiEndpoint + "/cart/send", { token: token, id: id, cart: cart })
            .then((response) => {
                console.log("Sent cart:", cart, response.data);
            })
            .catch((error) => console.error("Error sending to cart:", error));
    }, [cart]);


    useEffect(() => {
        const checkToken = async () => {
            axios
                .post(config.apiEndpoint + "/user/check", { token: token, id: id })
                .then((response) => {if (response.data.error_code !== 0) setTokenOk(false)})
                .catch((error) => setTokenOk(false));
        };
        const loadProducts = async () => {
            axios
                .get(config.apiEndpoint + "/products/get")
                .then((response) => {
                    console.log("Products loaded.")
                    setProducts(response.data)
                })
                .catch((error) => console.error("Error fetching products:", error));
        }
        const loadCart = async () => {
            axios
                .post(config.apiEndpoint + "/cart/load", { token: token, id: id })
                .then((response) => {
                    console.log("Cart loaded:", response.data)
                    setCart(response.data)
                    setLockSend(false)
                })
                .catch((error) => console.error("Error fetching cart:", error));
        }
        checkToken().then(async () => {
            if (tokenOk) {
                console.log("Token ok.")
                await loadCart()
                await loadProducts()
                setLoaded(true)
                console.log("Ready.")
            }
        });
    }, []);

    function arrayBufferToBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    return (
        <div className="products-list">
            {!loaded && <Spin fullscreen></Spin>}
            {tokenOk ? (
                <>{
                    products.map((product) => (
                        <Card key={product.id} className="product-card">
                            {/* Ваш код изображения */}
                            <img
                                className="product-image"
                                src={`data:image/png;base64,${arrayBufferToBase64(product.img.data)}`}
                                alt={product.title}
                            />
                            <div className="product-details">
                                <div className="title">{product.title}</div>
                                <div className="description">{product.description}</div>
                                <br/>
                                <Button
                                    className="add-btn"
                                    onClick={() => handleToCart(product.id, product.title, product.price)}>
                                    {cart.some((item) => item.id === product.id) ? "Убрать" : "В корзину"}
                                </Button>
                                <div className="price"><b>{product.price}₽</b></div>
                            </div>
                        </Card>
                    ))}
                </>
            ) : (
                <p style={{ color: "red", textAlign: "center" }}>Session not valid.</p>
            )}

            {/* Общий счетчик */}
            <div className="total-counter">
                <h2 style={{textAlign: "center"}}>Корзина: {getTotal()}₽</h2>
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            {item.tittle}: {item.price}₽
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {getTotal() > 1 && <MainButton text={"Оформить заказ"} onClick={() => sendData()}/>}
                <button onClick={() => sendData()}>Оформить заказ</button>
            </div>
        </div>
    );
};

export default Products;