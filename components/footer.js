import React from 'react';
import { Box, Paragraph, Heading, Image } from 'grommet';

const Footer = () => (
    <Box direction='row' pad="small" justify="center"
    align="center">
        <Box width="xlarge" align="start" direction="column" pad="small">
            <Heading level='6'>Powered by Shopy</Heading>
        </Box>
        <Box width="xlarge" direction="column" align="end" pad="small">
            <Box>
                <Heading level='6'>Social</Heading>
            </Box>
            <Box direction="row" align="end">
                <a href='http://www.facebook.com/sharer.php?u=http://www.horizontalworking.com'>
                    <Image style={{ maxWidth: '50%' }} src='https://simplesharebuttons.com/images/somacro/facebook.png' alt='Facebook' />
                </a>
                <a href='https://twitter.com/share?url=http://www.horizontalworking.com&text=Horizontal%20Working%20News&hashtags=horizontalworking'>
                    <Image style={{ maxWidth: '50%' }} src='https://simplesharebuttons.com/images/somacro/twitter.png' alt='buffer' />
                </a>
            </Box>
        </Box>
    </Box>
);

export default Footer;