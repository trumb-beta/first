import Image from "next/image"
import Navbar from '../components/Navbar'
import FinancialServiceMenu from '../components/FinancialServiceMenu'
import Footer from '../components/Footer'
import Personalloan from '../components/Personalloan'
import PersonalloanButton from '../components/PersonalLoanButton'

export default function Home() {
  return (
    <div>
<Navbar/>

<FinancialServiceMenu/>
<Personalloan/>
<Footer/>


    </div>
  );
}
