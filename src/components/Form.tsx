import React, {useEffect, useState} from 'react';
import {MainButton, MainButtonProps} from "@vkruglikov/react-telegram-web-app";

export const Form = () => {

    const [name, setName] = useState('');
    const [town, setTown] = useState('');
    const [street, setStreet] = useState('');
    const [mobile, setMobile] = useState('');
    const [buttonState, setButtonState] = useState<
        { show: boolean; } & Pick<MainButtonProps, 'text' | 'progress' | 'disable'>>();

    useEffect(() => {
        if(name && town && street && mobile) {
            setButtonState({text: "Отправить", show: true})
        } else {
            setButtonState({show: false})
        }
    }, [name, town, street, mobile])

    const onChangeName = (e: any) => {
        setName(e.target.value)
    }

    const onChangeTown = (e: any) => {
        setTown(e.target.value)
    }

    const onChangeStreet = (e: any) => {
        setStreet(e.target.value)
    }
    const onChangeMobile = (e: any) => {
        setMobile(e.target.value)
    }

    return (
        <div className={"form"}>

            <h3 style={{textAlign: "center"}}>Введите данные для связи</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'Ваше имя'}
                value={name}
                onChange={onChangeName}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Населенный пункт'}
                value={town}
                onChange={onChangeTown}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Улица, номер дома и квартиры'}
                value={street}
                onChange={onChangeStreet}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Номер телефона для связи'}
                value={mobile}
                onChange={onChangeMobile}
            />
            <div>{buttonState?.show ? <MainButton {...buttonState} /> :
                <h4 className={"underFormText"}>Введите все данные что бы продолжить.</h4>
            }</div>
        </div>
    );
};
