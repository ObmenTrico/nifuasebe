import React, {useEffect, useRef, useState} from 'react';
import {MainButton, MainButtonProps, useShowPopup} from "@vkruglikov/react-telegram-web-app";
import axios from 'axios';
import {config} from "../config";

export const Form: React.FC = () => {

    const showPopup = useShowPopup();
    const [name, setName] = useState('');
    const [town, setTown] = useState('');
    const [street, setStreet] = useState('');
    const [mobile, setMobile] = useState('');
    const [buttonState, setButtonState] = useState<
        { show: boolean; } & Pick<MainButtonProps, 'text' | 'progress' | 'disable'>>();

    const [userData, setUserData] = useState({
        "name": "", "town": "", "street": "", "mobile": "", "createdAt": "", "updatedAt": ""
    });
    const [tokenOk, setTokenOk] = useState(true);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const token = params.get('token');

    const sendData = () => {
        axios.post(
            config.apiEndpoint + '/user/add',
            { id: id, token: token, name: name, town: town, street: street, mobile: mobile}
        )
        setUserData({name: name, town: town, street: street, mobile: mobile, createdAt: '1', updatedAt: '1'})
        setName('');
        setTown('');
        setStreet('');
        setMobile('');
        showPopup({
            message: 'Данные приняты.',
        })
    }

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.post(
                    config.apiEndpoint + '/user/check',
                    { id: id, token: token }
                )
                if (response.data.error_code !== 0) {
                    setTokenOk(false);
                }
            } catch (error: any) {
                console.error('Error checking token:', error.message);
            }
        };
        const downloadUser = async () => {
            try {
                const response = await axios.post(
                    config.apiEndpoint + '/user/read',
                    { id: id, token: token }
                )
                if (response.data.error_code === undefined) {
                    setUserData(response.data);
                }
            } catch (error: any) {
                console.error('Error checking token:', error.message);
            }
        };
        checkToken().then(async (x: any) => {
            if (tokenOk)
                await downloadUser()
        });
    }, [id, token]);

    useEffect(() => {
        if(name && town && street && mobile) {
            setButtonState({show: true})
        } else {
            setButtonState({show: false})
        }
    }, [name, town, street, mobile])

    return (
        <div className={"form"}>
            {tokenOk ? <></> : <p style={{color: "red", textAlign: "center"}}>No token or id found! Session not valid.</p>}
            {userData.name ? <>
                    <h3 style={{color: "green", textAlign: "center"}}>Вы уже ввели данные:</h3>
                    <p>Имя: {userData.name}</p>
                    <p>Населенный пункт: {userData.town}</p>
                    <p>Улица: {userData.street}</p>
                    <p>Телефона: {userData.mobile}</p>
                    <br/>
                    <br/>
                    <h3 style={{textAlign: "center"}}>Введите данные</h3>
                    <p style={{textAlign: "center"}}>Если нужно обновить</p>
                </> :
                <h3 style={{textAlign: "center"}}>Введите данные для связи</h3>}
            <input
                className={'input'}
                type="text"
                placeholder={'Ваше имя'}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Населенный пункт'}
                value={town}
                onChange={(e) => setTown(e.target.value)}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Улица, номер дома и квартиры'}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Номер телефона для связи'}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
            />
            <div>{buttonState?.show ? <MainButton text={userData.name ? "Обновить" : "Отправить"} onClick={() => sendData()} {...buttonState} /> :
                <h4 className={"underFormText"}>{userData.name ? "Что бы обновить введите все данные" : "Введите все данные что бы продолжить"}</h4>
            }</div>
        </div>
    );
};
