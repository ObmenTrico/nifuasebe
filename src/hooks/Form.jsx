import React, {useCallback, useEffect, useState} from 'react';
import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [uname, setUname] = useState('');
    const [city, setCity] = useState('');
    const [adres, setAdres] = useState('');
    const [numberphone, setNumberphone] = useState('');
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            uname,
            city,
            adres,
            numberphone,
        }
        tg.sendData(JSON.stringify(data));
    }, [UName, city, adres, numberphone])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
    }, [])

    useEffect(() => {
        if(!UName || !city || !adres || !numberphone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [UName, city, adres, numberphone])

    const onChangeUName = (e) => {
        setUname(e.target.value)
    }

    const onChangeCity = (e) => {
        setCity(e.target.value)
    }

    const onChangeAdres = (e) => {
        setAdres(e.target.value)
    }

    const onChangeNumberphone = (e) => {
        setNumberphone(e.target.value)
    }

    return (
        <div className={"form"}>
            <h3>Введите Ваши данные</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'Ваше имя'}
                value={uname}
                onChange={onChangeUName}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Ваш населенный пункт'}
                value={city}
                onChange={onChangeCity}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Улица, номер дома, номер квартиры'}
                value={adres}
                onChange={onChangeAdres}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Ваш номер телефона'}
                value={numberphone}
                onChange={onChangeNumberphone}
            />
        </div>
    );
};

export default Form;
