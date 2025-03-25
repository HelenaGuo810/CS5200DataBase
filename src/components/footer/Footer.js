import {Link} from 'react-router-dom';

import './Footer.css';
import Logo from '../../assets/static/logo.png';
import iconArrow from '../../assets/icons/icon-arrow.svg';

const Footer = () => {
    return(
        <div className='footer-container'>
            <div className='logo-container'>
                <Link to='/'>
                    <img className='logo' src={Logo} alt='logo'/>
                </Link>
            </div>

            <div className='footer-links-container'>
                <Link className='nav-link' to='/portfolio'>Portfolio</Link>
                <Link className='nav-link' to='/about'>About Us</Link>
                <Link className='nav-link' to='/contact'>Contact</Link>
            </div>

            <Link className='button-link' to='/portfolio'>
                <div className='button'>
                    <h4>See Our Portfolio</h4>
                    <img className='arrow-icon' src={iconArrow} alt='arrow'/>
                </div>
            </Link>

        </div>
    )
}

export default Footer;
