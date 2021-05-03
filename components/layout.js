import React from 'react';
import { Grommet, Box } from 'grommet';
// import { materiallight } from 'grommet-controls/themes';
import Head from 'next/head';
import Header from './header.js';
import Footer from './footer.js';

const Layout = props => (
    <Grommet full={true}>
        <Head>
            <title>{props.siteName}</title>
        </Head>
        <Header siteName={props.siteName} />
        <Box justify="center"
            align="center"
            pad="xxsmall">
            {props.children}
        <Footer />
        </Box>
    </Grommet>
);

export default Layout;