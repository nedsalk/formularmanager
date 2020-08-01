import { openDB, DBSchema } from 'idb';

export async function InitiateIndexedDB() {

    type formularRowType = {
        label: string,
        inputType: string,
        inputStatus: string,
        radioButtonLabels?: string[]
    };

    interface FormularDatabase extends DBSchema {
        'formularTemplates': {
            value: {
                nameOfFormular: string,
                formularTemplateVersion: number,
                formularTemplate: formularRowType[]
            },
            key: string,
            indexes: {
                'by-nameOfFormular': string,
                'by-formularTemplateVersion': number
            }
        };
        'savedFormularData': {
            value: {
                nameOfFormular: string,
                formularTemplateVersion: number,
                version: number
                data: (string | number | boolean)[]
            },
            key: string,
            indexes: {
                'by-nameOfFormular': string,
                'by-version': number
            }
        };
    }
    const db = await openDB<FormularDatabase>('formularDatabase', 1, {
        upgrade(db) {
            // Template for Administration tab
            const formularTemplates = db.createObjectStore('formularTemplates', {
                keyPath: 'id',
                autoIncrement: true
            });
            formularTemplates.createIndex('by-nameOfFormular', 'nameOfFormular');
            formularTemplates.createIndex('by-formularTemplateVersion', 'formularTemplateVersion');

            // Template for saving data inputted in Formular tab
            const savedFormularData = db.createObjectStore('savedFormularData', {
                keyPath: ['nameOfFormular','version'],
                autoIncrement: false
            });
            savedFormularData.createIndex('by-nameOfFormular', 'nameOfFormular');
            savedFormularData.createIndex('by-version', 'version');
        }
    });
}
