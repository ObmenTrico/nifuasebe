import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Spin} from "antd";
import axios from "axios";
import { config } from "../config";
import "./Products.css"
import {MainButton, useShowPopup} from "@vkruglikov/react-telegram-web-app";
import {Form} from "./Form";

interface Product {
    id: number
    img: any
    title: string
    description: string
    price: number
}
interface Cart {
    id: number
    title: string
    price: number
}

const Products: React.FC = () => {
    const showPopup = useShowPopup();
    const [formOk, setFormOk] = useState(false);
    const callbackRef = useRef<Function>();
    const handleOnRef = (callback: Function) => { callbackRef.current = callback }
    const [products, setProducts] = useState<Product[]>([]);
    const [tokenState, setTokenState] = useState(0);
    const [userState, setUserState] = useState(-1);
    const [cart, setCart] = useState<Cart[]>([]);
    const _params = new URLSearchParams(window.location.search);
    const id = _params.get("id");
    const token = _params.get("token");

    const sendData = () => {
        const sd = callbackRef?.current?.()
        console.log("[Prod] callbackRef:", sd)
        if (sd){
            axios.post(
                config.apiEndpoint + '/cart/order',
                {id: id, token: token
                }).then(async () =>{
                    await showPopup({
                        message: 'Заказ принят',
                    })
                    setCart([])
                }).catch(async () => {
                    await showPopup({
                        message: 'Ошибка',
                    })
            })
        }
    }

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price, 0)
    }

    const handleToCart = (productId: number, title: string, productPrice: number) => {
        const isProductInCart = cart.some((item) => item.id === productId);

        if (!isProductInCart) {
            setCart([...cart, { id: productId, title: title, price: productPrice }])
        } else {
            const updatedCart = cart.filter((item) => item.id !== productId)
            setCart(updatedCart)
        }
    }

    useEffect(() => {
        if (products.length === 0)
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
            await axios
                .post(config.apiEndpoint + "/user/check", { token: token, id: id })
                .then((response) => {
                    if (response.data.error_code === 0){
                        console.log("Token ok.")
                        setTokenState(1)
                    }
                    else
                        setTokenState(2)
                }
                )
                .catch(() => setTokenState(2));
            await axios.post(config.apiEndpoint + '/user/read', { token: token, id: id })
                .then( r => {
                    if (r.data.error_code === undefined) {
                        setUserState(r.data.state)
                    }
                })
                .catch(e => console.error('Error downloadUser:', e.message))
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
                })
                .catch((error) => console.error("Error fetching cart:", error));
        }
        checkToken().then(async () => {
            await loadCart()
            await loadProducts()
            console.log("Ready.")
        });
    }, []);

    useEffect(() => {
        console.log("formOk", formOk)
    }, [formOk]);

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
            {products.length === 0 && <Spin fullscreen/>}
            {tokenState === 0 && <p style={{color: "green", textAlign: "center"}}>Загрузка...</p>}
            {tokenState === 2 && <p style={{color: "red", textAlign: "center"}}>Session not valid.</p>}
            {tokenState === 1 && userState !== 2 && <>{
                products.map((product) => (
                    <Card key={product.id} className="product-card">
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
                <div className="total-counter">
                    <h2 style={{textAlign: "center"}}>Корзина: {getTotal()}₽</h2>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                {item.title}: {item.price}₽
                            </li>
                        ))}
                    </ul>
                </div>
                <Form fromProducts setFormOk={setFormOk} onRef={handleOnRef}/>
                <div>
                    {getTotal() > 1 && formOk && <MainButton text={"Оформить заказ"} onClick={() => sendData()}/>}
                </div>
            </>}
            {tokenState === 1 && userState === 2 && <>
                <p>Вы уже сделали заказ</p>
            </>}
        </div>
    );
};

export default Products;
