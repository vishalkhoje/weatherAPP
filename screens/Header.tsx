import React, {FC} from 'react';
import {Appbar, Title} from 'react-native-paper';

interface IProps {
    title: string;
}

const Header: FC<IProps> = (props: IProps) => {
    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: '#00aaff',
                },
            }}
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
            <Title style={{color: 'white'}}>{props.title}</Title>
        </Appbar.Header>
    );
};

export default Header;
