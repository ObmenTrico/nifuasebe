import React, {useCallback, useEffect, useState} from 'react';
import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";
import ProductItem from "../ProductItem/ProductItem";




import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";

const products = [
    {id: '1', title: 'Обмен', price: 7500, description: 'Обмен Русский мир на Триколор'},
    {id: '2', title: 'Дополнительно', price: 5000, description: 'Дополнительный приемник Русский Мир'},
    {id: '3', title: 'Установка', price: 12000, description: 'Первичная установка Триколор'},
]





const Form = () => {
    const [uname, setUname] = useState('');
    const [punkt, setPunkt] = useState('');
    const [street, setStreet] = useState('');
    const [phone, setPhone] = useState('');
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            uname,
            punkt,
            street,
            phone,
        }
        tg.sendData(JSON.stringify(data));
    }, [uname, punkt, street, phone])

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
        if(!uname || !street || !punkt ||!phone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [uname, punkt, street, phone])

    const onChangeUname = (e) => {
        setUname(e.target.value)
    }

    const onChangePunkt = (e) => {
        setPunkt(e.target.value)
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value)
    }
    const onChangePhone = (e) => {
        setPhone(e.target.value)
    }

    return (
        <div className={"form"}>




            <div className={'list'}>
                {products.map(item => (
                    <ProductItem
                        product={item}
                        onAdd={onAdd}
                        className={'item'}
                    />
                ))}
            </div>









            <h3>Введите ваши данные</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'Напишите Ваше имя'}
                value={uname}
                onChange={onChangeUname}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Напишите Ваш населенный пункт'}
                value={punkt}
                onChange={onChangePunkt}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Напишите Вашу улицу, номер дома, квартиры'}
                value={street}
                onChange={onChangeStreet}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Напишите номер телефона для связи'}
                value={phone}
                onChange={onChangePhone}
            />
        </div>
    );
};

export default Form;
