import React from 'react';
import { MainButton } from "@vkruglikov/react-telegram-web-app";
import axios from 'axios';
import {config} from "../config";
import {Spin} from "antd";

interface FormProps {
    fromProducts?: boolean
    setFormOk?: React.Dispatch<React.SetStateAction<boolean>>
    onRef?: (callback: Function) => void;
}
interface User {
    name: string
    town: string
    street: string
    mobile: string
    state: number
}

interface State {
    tokenOK: boolean
    button: boolean
    name: string
    town: string
    street: string
    mobile: string
    user: User
}

export class Form extends React.Component<FormProps>{
    private id: string | null = ""
    private token: string | null = ""
    state: State = {
        tokenOK: true,
        button: false,
        name: '',
        town: '',
        street: '',
        mobile: '',
        user: {
            name: '',
            town: '',
            street: '',
            mobile:'',
            state: -1.
        }
    }

    async componentDidMount() {
        this.props.onRef?.(() => {
            return this.sendData(true)
        });
        const params = new URLSearchParams(window.location.search);
        this.id = params.get('id')
        this.token = params.get('token')
        // checkToken
        await axios.post(config.apiEndpoint + '/user/check', { id: this.id, token: this.token })
            .then(r => {
                if (r.data.error_code === 0) {
                    this.setState({tokenOK: false})
                }})
            .catch((e) => {
                console.log("Error checkToken: ", e.message)
                this.setState({tokenOK: false})
            })
        // downloadUser
        await axios.post(config.apiEndpoint + '/user/read', { id: this.id, token: this.token })
            .then( r => {
                if (r.data.error_code === undefined) {
                    this.setState({user: r.data})
                    if (r.data.state > 0)
                        this.props.setFormOk?.(true)
                }
            })
            .catch(e => console.error('Error downloadUser:', e.message))
    }

    async sendData(fromProducts: boolean) {
        // @ts-ignore
        const tg = window["Telegram"].WebApp
        if (fromProducts && (!this.state.name || !this.state.town || !this.state.street || !this.state.mobile))
            return
        console.log("[form] sendData: fromProducts", fromProducts)
        try {
            const r = await axios.post(
                config.apiEndpoint + '/user/add',
                {id: this.id, token: this.token, name: this.state.name, town: this.state.town, street: this.state.street, mobile: this.state.mobile}
            )
            const code = r.data.error_code
            if (code === 0){
                this.setState({name: '', town: '', street: '', mobile: '', user: {
                        name: this.state.name, town: this.state.town,
                        street: this.state.town, mobile: this.state.mobile, state: 1
                    }})
                if (fromProducts)
                    return true
                tg.showAlert('Данные приняты')
            } else if (code === 100) {
                this.setState({mobile: ''})
                tg.showAlert('Номер телефона введён неверно')
            }
        } catch {
            tg.showAlert('Произошла внутреняя ошибка')
        }
    }

    buttonHandle(state: {}){
        this.setState(state)
        let _state = {...this.state, ...state}
        if (!this.props.fromProducts) {
            if(_state.name && _state.town && _state.street && _state.mobile) {
                this.setState({button: true})
            } else {
                this.setState({button: false})
            }
        } else {
            if(_state.name && _state.town && _state.street && _state.mobile) {
                this.props.setFormOk?.(true)
            } else {
                this.props.setFormOk?.(false)
            }
        }
    }

    render() {
        const { fromProducts } = this.props
        const state = this.state.user.state

        return (
            <div className={"form"}>
                {!this.state.tokenOK ? <></> : <p style={{color: "red", textAlign: "center"}}>Session not valid.</p>}
                {state < 0 && <Spin fullscreen/>}

                {state > 0 ?
                    <>
                        <h3 style={{color: "green", textAlign: "center"}}>Вы уже ввели данные:</h3>
                        <div className={"formTable"}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>Имя</td>
                                    <td style={{ wordBreak: "break-all" }}>{this.state.user.name}</td>
                                </tr>
                                <tr>
                                    <td>Адрес</td>
                                    <td style={{ wordBreak: "break-all" }}>{this.state.user.town} {this.state.user.street}</td>
                                </tr>
                                <tr>
                                    <td>Телефон</td>
                                    <td style={{ wordBreak: "break-all" }}>{this.state.user.mobile}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <br/>
                        <br/>
                        {fromProducts ?
                            <h4 className={state > 0 ? "underFormTextGreen": "underFormText"}>{state > 0 ? "Что бы обновить введите все данные" : "Обновите данные, если нужно"}</h4> :
                            <>
                                <h3 style={{textAlign: "center"}}>Введите данные</h3>
                                <p style={{textAlign: "center"}}>Если нужно обновить</p>
                            </>
                        }
                    </> :
                    <h3 style={{textAlign: "center"}}>Введите данные для связи</h3>}
                <input
                    className={'input'}
                    type="text"
                    placeholder={'Ваше имя'}
                    value={this.state.name}
                    onChange={(e) => this.buttonHandle({name: e.target.value})}
                />
                <input
                    className={'input'}
                    type="text"
                    placeholder={'Населенный пункт'}
                    value={this.state.town}
                    onChange={(e) => this.buttonHandle({town: e.target.value})}
                />
                <input
                    className={'input'}
                    type="text"
                    placeholder={'Улица, номер дома и квартиры'}
                    value={this.state.street}
                    onChange={(e) => this.buttonHandle({street: e.target.value})}
                />
                <input
                    className={'input'}
                    type="text"
                    placeholder={'Номер телефона для связи'}
                    value={this.state.mobile}
                    onChange={(e) => this.buttonHandle({mobile: e.target.value})}
                />
                {!fromProducts && <div>
                    {this.state.button ?
                        <MainButton text={state > 0 ? "Обновить" : "Отправить"}
                                    onClick={() => this.sendData(false)} /> :
                        <h4 className={"underFormText"}>{state > 0 ? "Что бы обновить введите все данные" : "Введите все данные что бы продолжить"}</h4>
                    }
                </div>}
            </div>
        );
    }

}
