import Head from 'next/head';
import TopNavbar from './TopNavbar';

const Header = () => {
    return (
    <>
    <Head>
        <title>Forward Pay</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <TopNavbar/>
    </>
    );
};

export default Header;