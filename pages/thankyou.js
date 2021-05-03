import { useRouter } from 'next/router'
import Layout from '../components/layout.js';
import { server, getConfig } from '../config';
export async function getServerSideProps(context) {
    let configDetails = getConfig()

    return {
        props: {
            configDetails
        }
    }
}
export default function thankyou({ configDetails }) {
    const router = useRouter()
    const { session_id } = router.query
    const [websiteName, setWebsiteName] = useState(configDetails.websiteName)
    
    return (
        <Layout siteName={websiteName}>
            <h1>Thank you for your order</h1>
        </Layout>
    )
}