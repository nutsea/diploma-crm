import './base.scss'
import './main.scss'
import './App.scss'
import { Header } from './components/header/Header';
import { AppRoutes } from './AppRoutes';
import { useContext, useEffect, useState } from 'react';
import { fetchCategoriesShip, fetchCourse, fetchExpressShip, fetchFee, fetchStandartShip } from './http/constantsAPI';
import { Context } from '.';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
    const [authcode, setAuthCode] = useState()
    const { constants } = useContext(Context)

    const getCourse = async () => {
        await fetchCourse().then(data => {
            constants.setCourse(data.value)
        })
        await fetchStandartShip().then(data => {
            constants.setStandartShip(data.value)
        })
        await fetchExpressShip().then(data => {
            constants.setExpressShip(data.value)
        })
        await fetchFee().then(data => {
            constants.setFee(data.value)
        })
        await fetchCategoriesShip().then(data => {
            constants.setCategoriesShips(data)
        })
    }

    useEffect(() => {
        getCourse()
        // eslint-disable-next-line
    }, [])

    return (
        <div className='App'>
            {constants.course && constants.standartShip && constants.expressShip && constants.categoriesShips && constants.fee ?
                <>
                    <Header authcode={authcode} />
                    <AppRoutes getAuthCode={setAuthCode} />
                </>
                :
                <div className='LoaderBox3'>
                    <div className='Loader'></div>
                </div>
            }
        </div>
    );
})