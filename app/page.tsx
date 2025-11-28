import Image from "next/image"
import Navbar from '../components/Navbar'
import FinancialServiceMenu from '../components/FinancialServiceMenu'
import Footer from '../components/Footer'
import Personalloan from '../components/Personalloan'
import Section from '../components/Section'

export default function Home() {
  return (
    <div>
<Navbar/>
<Section/>
<FinancialServiceMenu/>
<Personalloan/>
<Footer/>


    </div>
  );
}
