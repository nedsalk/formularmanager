import React, { useState } from 'react';

function SearchFormular (props: any) {

    const [formularVersion, setFormularVersion] = useState(0)
    const [typedNameOfFormular, setTypedNameOfFormular] = useState('');

    return (
        <form className="searchFormularName" onSubmit={(e: React.FormEvent):void => {
            e.preventDefault();
            if (props.setFormularVersion !== undefined)
            props.setFormularVersion(formularVersion);
            props.setSearchedNameOfFormular(typedNameOfFormular);
        }}>
            <h4>Formular name </h4>
            <input
                type="text"
                placeholder="Search formular name"
                value={typedNameOfFormular}
                name='formularName' id="formularName"
                className='searchInput'
                onChange={(e: React.ChangeEvent<HTMLInputElement>):void => { setTypedNameOfFormular(e.currentTarget.value) }}
            />
            {props.setFormularVersion !== undefined &&
            [<h4>Version &nbsp;</h4>,
            <input 
            type="text"
            pattern={'[0-9]+'}
            value={formularVersion||0}
            className='formularVersion'
            onChange={(e:React.ChangeEvent<HTMLInputElement>):void => {setFormularVersion(Number(e.currentTarget.value))}}/>]}
            <button className='searchButton' type="submit">{props.setFormularVersion !== undefined ? 'Load data' : 'Search'}</button>
        </form>
    )
};

export default SearchFormular