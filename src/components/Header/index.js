import React from 'react';
import { Link } from "react-router-dom";
import styles from './header.module.scss';

const Header = () => (
    <div className={styles.header}>
        <nav id="menu" className="menu">
          <ul>
            <li><Link to="/"> Home <span style={{ padding: "100px" }}></span></Link></li>

            <li><Link to="/mint"> Mint </Link></li>

            <li><Link to="/minted-images"> My Images </Link></li>

            <li><Link to="/marketplace"> Marketplace </Link></li>

          </ul>
        </nav>
    </div>
)

export default Header;
