import React, {useCallback, useEffect, useState} from 'react';
import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [uname, setUname] = useState('');
    const [punkt, setPunkt] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            uname,
            punkt,
            street,
            subject
        }
        tg.sendData(JSON.stringify(data));
    }, [uname, punkt, street, subject])

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
        if(!uname || !street || !punkt) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [uname, punkt, street])

    const onChangeUname = (e) => {
        setUname(e.target.value)
    }

    const onChangePunkt = (e) => {
        setPunkt(e.target.value)
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value)
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value)
    }

    return (
        <div className={"form"}>
            <h3>Введите ваши данные</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'Введите Ваше имя'}
                value={uname}
                onChange={onChangeUname}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Населенный пункт'}
                value={punkt}
                onChange={onChangePunkt}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Улица'}
                value={street}
                onChange={onChangeStreet}
            />
            <select value={subject} onChange={onChangeSubject} className={'select'}>
                <option value={'physical'}>Физ. лицо</option>
                <option value={'legal'}>Юр. лицо</option>
            </select>
        </div>
    );
};

export default Form;
