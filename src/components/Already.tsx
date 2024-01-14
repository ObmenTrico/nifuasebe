import React from "react";
import axios from "axios";
import {config} from "../config";
import {Button, Card} from "antd";

interface Product {
    id: number
    img: any
    title: string
    description: string
    price: number
}

interface AlreadyProps {
    product: Product[]
}

interface State {
    id: number,
    order: Product[]
    canceled: boolean
}


export class Already extends React.Component<AlreadyProps>{
    private id: string | null = ""
    private token: string | null = ""
    state: State = {
        id: -1,
        order: [{id: 0, img: "", price: 0, title: "", description: ""}],
        canceled: false
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        this.id = params.get('id')
        this.token = params.get('token')
        // getOrder
        axios.post(config.apiEndpoint + '/order/get', { id: this.id, token: this.token })
            .then(r => {
                // noinspection JSUnresolvedReference
                if (!r.data.error_code) {
                    let o: Product[] = []
                    console.log("order", r.data)
                    r.data.data.forEach((j: any) => {
                        this.props.product.forEach((i) => {
                            if (i.id === j.id) {
                                o = [...o,...[i]]
                                console.log("add product", i)
                            }
                        })
                    })
                    // eslint-disable-next-line
                    this.state.order = o
                    this.setState({id: r.data.id})
                }})
            .catch((e) => {
                console.log("Error checkToken: ", e.message)
                this.setState({tokenOK: false})
            })
    }

    delOrder() {
        axios.post(config.apiEndpoint + '/order/del', { id: this.id, token: this.token }).then((r) => {
            if (!r.data.error_code) {
                this.setState({canceled: true})
            }
        })
    }

    arrayBufferToBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    render() {
        return (<>
            <div style={{textAlign: "center", width: "100%"}}>
                {
                    this.state.canceled ?
                        <h2>Вы отменили заказ</h2>:
                        <h2>Вы уже сделали заказ</h2>
                }
                <p>Заказ №{this.state.id}</p>
            </div>
            {this.state.order.map((product) => (
                <Card key={product.id} className="product-card">
                    <img
                        className="product-image"
                        src={`data:image/png;base64,${this.arrayBufferToBase64(product.img.data)}`}
                        alt={product.title}
                    />
                    <div className="product-details">
                        <div className="title">{product.title}</div>
                        <div className="description">{product.description}</div>
                        <br/>
                        <div className="price"><b>{product.price}₽</b></div>
                    </div>
                </Card>
            ))}
            {!this.state.canceled &&
                <div style={{textAlign: "center", width: "100%"}}>
                    <Button type="primary" onClick={() => this.delOrder()} danger>Отменить заказ</Button>
                </div>
            }
            </>
        );
    }

}