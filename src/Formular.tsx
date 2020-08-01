import React, { useState, useEffect } from 'react';
import SearchFormular from './SearchFormular';
import { openDB } from 'idb';
import InputFormularData from './InputFormularData';

function Formular() {

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
  type inputFormularDataType = {
    nameOfFormular: string,
    formularTemplateVersion: number,
    version: number,
    formularTemplate: formularRowType[]
    formularData: (string | number | boolean)[]
  }

  // Declaration of blank constants for state management
  const blankFormularRow: formularRowType = {
    label: '',
    inputType: 'textbox',
    inputStatus: 'none',
    radioButtonLabels: ['', '']
  };
  const blankInputFormularData: inputFormularDataType = {
    nameOfFormular: '',
    formularTemplateVersion: 0,
    version: 0,
    formularTemplate: [blankFormularRow],
    formularData: []
  };

  // Declaration of states
  const [inputFormularData, setInputFormularData] = useState(blankInputFormularData);
  const [finalInputFormularData, setFinalInputFormularData] = useState(blankInputFormularData);
  const [searchedNameOfFormular, setSearchedNameOfFormular] = useState('');
  const [formularVersion, setFormularVersion] = useState(0);


  // Get data from IndexedDB database on useEffect trigger
  async function getFromDatabase() {
    const formularDatabase = await openDB('formularDatabase', 1);
    const searchedFormularTemplates = await formularDatabase.getAllFromIndex('formularTemplates', 'by-nameOfFormular', searchedNameOfFormular);

    //Check if formularTemplate exists and return if not
    if (searchedFormularTemplates.length === 0) {
      alert(`There is no formular named '${searchedNameOfFormular}'!`);
      setSearchedNameOfFormular('');
      return;
    };

    const searchedSavedFormularData = await formularDatabase.getAllFromIndex('savedFormularData', 'by-nameOfFormular', searchedNameOfFormular);

    // Formular name exists but saved formular data version doesn't
    if (searchedSavedFormularData.length <= formularVersion) {
      alert(`
      There is no version ${formularVersion} of saved data with formular '${searchedNameOfFormular}'.
      You can input new data below, which will be saved 
      under version ${searchedSavedFormularData.length} of the latest formular template version of '${searchedNameOfFormular}'.`);
      setInputFormularData({
        nameOfFormular: searchedNameOfFormular,
        formularTemplateVersion: searchedFormularTemplates.length-1,
        version: searchedSavedFormularData.length,
        formularTemplate: searchedFormularTemplates[searchedFormularTemplates.length-1].formularTemplate,
        formularData: Array(searchedFormularTemplates[searchedFormularTemplates.length-1].formularTemplate.length).fill('')
      });
      return;
    };

    // Both formular name and saved formular data version exist
    let existingSavedFormularData = searchedSavedFormularData.find(obj => obj.version === formularVersion);
    existingSavedFormularData.formularTemplate = searchedFormularTemplates.find(
      obj => obj.formularTemplateVersion === existingSavedFormularData.formularTemplateVersion).formularTemplate;
    setInputFormularData(existingSavedFormularData);
  };

  useEffect(() => {
    if (searchedNameOfFormular === '') return;
    if (searchedNameOfFormular === '' && formularVersion === 0) return;
    getFromDatabase();
  }, [searchedNameOfFormular, formularVersion])


  // Save data to IndexedDB database on useEffect triggered by finalInputFormularData change
  async function saveToDatabase() {
    const formularDatabase = await openDB('formularDatabase', 1);
    let savedFormularData = { ...finalInputFormularData };
    delete savedFormularData.formularTemplate;
    await formularDatabase.put('savedFormularData', savedFormularData);
  };

  useEffect(() => {
    if (finalInputFormularData === blankInputFormularData) return;
    saveToDatabase();
  }, [finalInputFormularData]);


  function saveFormular(e: React.FormEvent): void {
    e.preventDefault();
    setFinalInputFormularData(inputFormularData);
    setSearchedNameOfFormular('');
    setInputFormularData(blankInputFormularData);
  };

  return (
    <div>
      <SearchFormular
        setSearchedNameOfFormular={setSearchedNameOfFormular}
        setFormularVersion={setFormularVersion} />
      {inputFormularData.nameOfFormular !== '' && (
        <form className='inputFormularData' onSubmit={saveFormular}>
          <InputFormularData
            inputFormularData={inputFormularData}
            setInputFormularData={setInputFormularData} />
          <br />
          <button type='submit'>Save data</button>
        </form>
      )}
    </div>)
}

export default Formular
