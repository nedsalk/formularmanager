import React, { useState, useEffect } from 'react';
import SearchFormular from './SearchFormular';
import EditFormularTemplate from './EditFormularTemplate';
import { openDB } from 'idb';

function Administration() {

  // Declaration of types
  type formularRowType = {
    label: string,
    inputType: string,
    inputStatus: string,
    radioButtonLabels: string[]
  };
  type formularTemplateType = {
    nameOfFormular: string,
    formularTemplateVersion: number,
    formularTemplate: formularRowType[]
  }

  // Declaration of blank constants for state management
  const blankFormularRow: formularRowType = {
    label: '',
    inputType: 'textbox',
    inputStatus: 'none',
    radioButtonLabels: ['', '']
  };
  const blankFormularTemplate: formularTemplateType = {
    nameOfFormular: '',
    formularTemplateVersion: 0,
    formularTemplate: [blankFormularRow]
  };

  const [searchedNameOfFormular, setSearchedNameOfFormular] = useState('');
  const [formularTemplate, setFormularTemplate] = useState(blankFormularTemplate);
  const [finalFormularTemplate, setFinalFormularTemplate] = useState(blankFormularTemplate);

  // Get data from IndexedDB database on useEffect trigger
  async function getFromDatabase() {
    const formularDatabase = await openDB('formularDatabase', 1);
    const newFormularTemplate = await formularDatabase.getAllFromIndex('formularTemplates', 'by-nameOfFormular', searchedNameOfFormular);
    if( newFormularTemplate.length === 0) setFormularTemplate({
      nameOfFormular: searchedNameOfFormular,
      formularTemplateVersion: 0,
      formularTemplate: [blankFormularRow]
    });
    else setFormularTemplate({
      nameOfFormular: searchedNameOfFormular,
      formularTemplateVersion: newFormularTemplate.length,
      formularTemplate: newFormularTemplate[newFormularTemplate.length-1].formularTemplate
    });
  };
 
  useEffect(() => {
    if (searchedNameOfFormular === '') return;
    getFromDatabase();
  }, [searchedNameOfFormular]);


  // Save data to database on useEffect trigger
  async function saveToDatabase() {
    const formularDatabase = await openDB('formularDatabase', 1);
    await formularDatabase.add('formularTemplates', finalFormularTemplate);
  };

  useEffect(() => {
    if (finalFormularTemplate === blankFormularTemplate) return;
    saveToDatabase();
  }, [finalFormularTemplate]);

  function submitFormularTemplate (e: React.FormEvent): void {
    e.preventDefault();
    let updatedFormularTemplate = [...formularTemplate.formularTemplate];

    // Delete reduntant radioButtonLabels
    for (let i in updatedFormularTemplate) {
      if (updatedFormularTemplate[i].inputType !== 'radio-buttons')
        delete updatedFormularTemplate[i].radioButtonLabels;
    };
    setFinalFormularTemplate({
      nameOfFormular: formularTemplate.nameOfFormular,
      formularTemplateVersion: formularTemplate.formularTemplateVersion,
      formularTemplate: updatedFormularTemplate
    });
    setSearchedNameOfFormular('');
    setFormularTemplate(blankFormularTemplate);
  };

  return (
    <div className='form-flex'>
      <SearchFormular
        setSearchedNameOfFormular={setSearchedNameOfFormular} />
      {formularTemplate.nameOfFormular !== '' && (
        <form className='formularTemplate' onSubmit={submitFormularTemplate}>
          <EditFormularTemplate
            setFormularTemplate={setFormularTemplate}
            formularTemplate={formularTemplate}
            blankFormularRow={blankFormularRow} />
          <br />
          <button className='submitButton' type='submit'>Save formular template</button>
        </form>)}
    </div>
  )
}

export default Administration