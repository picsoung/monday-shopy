import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Header, Anchor } from 'grommet';
import Link from 'next/link';
import CartComponent from './cart'

export default function SiteHeader({ siteName }) {
    const [websiteName, setWebsiteName] = useState(siteName)

    return (
        <Header background="light-4" pad="medium" height="xsmall">
            <Anchor
                href="/"
                label={websiteName}
            />
            <Box justify='end' >
                <CartComponent />
             </Box>
        </Header>
    )
};