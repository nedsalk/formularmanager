import React from 'react';
import { Link } from 'react-router-dom';


function Nav() {
    return (
        <div className='navigation'>
            <div className='element'>
                <Link to='/Administration'>
                    Administration
            </Link>
            </div>
            <div className='element'>
                <Link to='/Formular'>
                    Formular
            </Link>
            </div>
        </div>
    );
}


export default Nav