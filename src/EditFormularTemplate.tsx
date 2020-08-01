import React from 'react';

function EditFormularTemplate(props: any) {

  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  type SelectEvent = React.ChangeEvent<HTMLSelectElement>;
  type ClickEvent = React.MouseEvent<HTMLButtonElement>;

  type formularRowType = {
    label: string,
    inputType: string,
    inputStatus: string,
    radioButtonLabels: string[]
  };

  function addFormularRow(e: ClickEvent): void {
    let updatedFormularTemplate = { ...props.formularTemplate };
    updatedFormularTemplate.formularTemplate = [...updatedFormularTemplate.formularTemplate, props.blankFormularRow];
    props.setFormularTemplate(updatedFormularTemplate);
  };

  function removeFormularRow(e: ClickEvent): void {

    let newFormularTemplate = { ...props.formularTemplate };

    const updatedFormularTemplateArray = (idx: number): formularRowType[] => {
      let formularTemplate = [...props.formularTemplate.formularTemplate];
      if (idx === 0) return [...formularTemplate.slice(1, formularTemplate.length)];
      else if (idx === formularTemplate.length - 1) return [...formularTemplate.slice(0, formularTemplate.length - 1)];
      else return [...formularTemplate.slice(0, idx),
      ...formularTemplate.slice(-(formularTemplate.length - idx - 1))];
    };

    newFormularTemplate.formularTemplate = updatedFormularTemplateArray(Number(e.currentTarget.dataset.idx));
    props.setFormularTemplate(newFormularTemplate);
  };

  const addRadioButtonLabel = (e: ClickEvent): void => {
    let updatedFormularTemplate = { ...props.formularTemplate };
    updatedFormularTemplate.formularTemplate[Number(e.currentTarget.dataset.rowidx)].radioButtonLabels.push('');
    props.setFormularTemplate(updatedFormularTemplate);
    // let updatedCompleteFormular = [...props.propCompleteFormular];
    // updatedCompleteFormular[Number(e.currentTarget.dataset.rowidx)].radioButtonLabels.push('');
    // props.propSetCompleteFormular(updatedCompleteFormular);
  };

  const removeRadioButtonLabel = (e: ClickEvent): void => {
    let updatedFormularTemplate = { ...props.formularTemplate };
    let rblidx = Number(e.currentTarget.dataset.idx);
    let idx = Number(e.currentTarget.dataset.rowidx);
    let radioButtonLabels = updatedFormularTemplate.formularTemplate[idx].radioButtonLabels;
 
    if (rblidx === 0)
      updatedFormularTemplate.formularTemplate[idx].radioButtonLabels = [...radioButtonLabels.slice(1, radioButtonLabels.length)];
    else if (rblidx === radioButtonLabels.length - 1)
      updatedFormularTemplate.formularTemplate[idx].radioButtonLabels = [...radioButtonLabels.slice(0, radioButtonLabels.length - 1)];
    else
      updatedFormularTemplate.formularTemplate[idx].radioButtonLabels = [...radioButtonLabels.slice(0, rblidx),
      ...radioButtonLabels.slice(-(radioButtonLabels.length - rblidx - 1))];

    props.setFormularTemplate(updatedFormularTemplate);
  };


  const radioButtonLabels = (idx: number) => {
    if (props.formularTemplate.formularTemplate[idx].radioButtonLabels === undefined)
      props.formularTemplate.formularTemplate[idx].radioButtonLabels = ['', ''];

    const radioButtonLabels = props.formularTemplate.formularTemplate[idx].radioButtonLabels;

    return (
      radioButtonLabels.map((val: string, rBLidx: number, arr: string[]) => {
        const radioButtonLabelId = `radio-button-label-${idx}-${rBLidx}`;
        const rowButtons = addOrRemoveRowButtons(
          rBLidx, arr, addRadioButtonLabel, removeRadioButtonLabel, idx);
        return (
          <div className="oneRadioButtonLabel">
            {[<input
              type="text"
              placeholder={`Radio buton label ${rBLidx + 1}`}
              data-idx={idx}
              data-rblidx={rBLidx}
              key={radioButtonLabelId}
              className="radioButtonLabels"
              value={radioButtonLabels[rBLidx]}
              onChange={handleCompleteFormularChange}
            />, rowButtons]}
          </div>

        )
      })
    )
  };

  const handleCompleteFormularChange = (e: InputEvent | SelectEvent): void => {
    const idx = Number(e.currentTarget.dataset.idx);
    const rblidx = Number(e.currentTarget.dataset.rblidx);
    const className = e.currentTarget.className;
    const value = e.currentTarget.value;

    let updatedFormularTemplate = { ...props.formularTemplate };
    if (Array.isArray(updatedFormularTemplate.formularTemplate[idx][className]))
      updatedFormularTemplate.formularTemplate[idx][className][rblidx] = value;
    else
      updatedFormularTemplate.formularTemplate[idx][className] = value;
    props.setFormularTemplate(updatedFormularTemplate);
  };

  const addOrRemoveRowButtons = (idx: number, arr: any[], addFunction: any, removeFunction: any, rowidx: number = 0) => {
    const addRowButton = <button type="button" key={`addRowButton-${idx}-${rowidx || '0'}`} className='fa fa-plus-circle'
      data-idx={idx} data-rowidx={rowidx} onClick={addFunction} />;
    const removeRowButton = <button type="button" key={`removeRowButton-${idx}-${rowidx || '0'}`} className='fa fa-minus-circle'
      data-idx={idx} data-rowidx={rowidx} onClick={removeFunction} />;
    if (arr.length - 1 === idx && idx === 0) return [addRowButton];
    else if (arr.length - 1 === idx) return [removeRowButton, addRowButton];
    return [removeRowButton];
  };

  return (
    props.formularTemplate.formularTemplate.map((val: formularRowType, idx: number) => {
      const labelValue = props.formularTemplate.formularTemplate[idx].label;
      const inputTypeValue = props.formularTemplate.formularTemplate[idx].inputType;
      const inputStatusValue = props.formularTemplate.formularTemplate[idx].inputStatus;

      const labelId = `label-${idx}`;
      const inputTypeId = `inputType-${idx}`;
      const inputStatusId = `inputStatus-${idx}`;
      return (
        <div key={`element-${idx}`} className='row-flex'>
          <div className='elementNumber'>
            Element {idx + 1}
          </div>
          <input
            type="text"
            value={labelValue}
            name={labelId}
            placeholder={`Label ${idx + 1}`}
            data-idx={idx}
            id={labelId}
            className="label"
            onChange={handleCompleteFormularChange}
          />
          <div className="inputTypeAll">
            <select
              value={inputTypeValue}
              name={inputTypeId}
              className="inputType"
              data-idx={idx}
              onChange={handleCompleteFormularChange}>
              <option value="textbox">Textbox</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio-buttons">Radio buttons</option>
            </select>
            {inputTypeValue === "radio-buttons" &&
              radioButtonLabels(idx)
            }
          </div>

          <select
            value={inputStatusValue}
            name={inputStatusId}
            className="inputStatus"
            data-idx={idx}
            onChange={handleCompleteFormularChange}>
            <option value="none">None</option>
            {inputTypeValue !== 'checkbox' && <option value="mandatory">Mandatory</option>}
            {inputTypeValue === 'textbox' && <option value="numeric">Numeric</option>}
          </select>
          {<div className='rowButtons'>
            {addOrRemoveRowButtons(idx, props.formularTemplate.formularTemplate, addFormularRow, removeFormularRow)}
          </div>}
        </div>
      )
    })
  )
}

export default EditFormularTemplate