import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularCars from '../libs/components/homepage/PopularCars';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TrendCars from '../libs/components/homepage/TrendCars';
import CarBrands from '../libs/components/homepage/CarBrands';
import InfoRent from '../libs/components/homepage/InfoRent';
import ChooseByCarType from '../libs/components/homepage/ChooseByCarType';
import HowItWorks from '../libs/components/homepage/HowItWorks';
import TopCars from '../libs/components/homepage/TopCars';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<CarBrands />
				<TrendCars />
				<InfoRent />
				<ChooseByCarType />
				<HowItWorks />
				<PopularCars />
				<CommunityBoards />
				<TopCars />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<CarBrands />
				<TrendCars />
				<InfoRent />
				<ChooseByCarType />
				<HowItWorks />
				<PopularCars />
				<CommunityBoards />
				<TopCars />
				<TopAgents />
				<Events />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
