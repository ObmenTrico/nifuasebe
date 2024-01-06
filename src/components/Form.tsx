import React, {useEffect, useState} from 'react';
import {MainButton, MainButtonProps} from "@vkruglikov/react-telegram-web-app";
import axios from 'axios';

export const Form = () => {

    const [name, setName] = useState('');
    const [town, setTown] = useState('');
    const [street, setStreet] = useState('');
    const [mobile, setMobile] = useState('');
    const [buttonState, setButtonState] = useState<
        { show: boolean; } & Pick<MainButtonProps, 'text' | 'progress' | 'disable'>>();

    const [tokenOk, setTokenOk] = useState(false);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const token = params.get('token');

    const sendData = () => {
        axios.post(
            'https://tg.anidev.ru/api/user/add',
            { id: id, token: token, name: name, town: town, street: street, mobile: mobile}
        )
    }

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.post(
                    'https://tg.anidev.ru/api/user/check',
                    { id: id, token: token }
                )
                if (response.data.error_code === 0) {
                    setTokenOk(true);
                }
            } catch (error: any) {
                console.error('Error checking token:', error.message);
            }
        };
        checkToken();
    }, []);

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
            <h3 style={{textAlign: "center"}}>Введите данные для связи</h3>
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
            <div>{buttonState?.show ? <MainButton text={"Отправить"} onClick={() => sendData()} {...buttonState} /> :
                <h4 className={"underFormText"}>Введите все данные что бы продолжить.</h4>
            }</div>
        </div>
    );
};
