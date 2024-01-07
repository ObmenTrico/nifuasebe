import React, {DispatchWithoutAction, FC} from "react";
import {useThemeParams} from "@vkruglikov/react-telegram-web-app";
import {ConfigProvider, theme} from "antd";
import Products from "./components/Products";
import {Route, Routes} from "react-router-dom";
import {Form} from "./components/Form";

export const App: FC<{
    onChangeTransition: DispatchWithoutAction;
}> = ({ onChangeTransition }) => {
    const [colorScheme, themeParams] = useThemeParams();

    return (
        <div>
            <ConfigProvider
                theme={
                    themeParams.text_color
                        ? {
                            algorithm:
                                colorScheme === 'dark'
                                    ? theme.darkAlgorithm
                                    : theme.defaultAlgorithm,
                            token: {
                                colorText: themeParams.text_color,
                                colorPrimary: themeParams.button_color,
                                colorBgBase: themeParams.bg_color,
                            },
                        }
                        : undefined
                }
            >
                <div className="contentWrapper">
                    <div className="App">
                        <Routes>
                            <Route index element={<Products/>}/>
                            <Route path={'form'} element={<Form />}/>
                        </Routes>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
};