const migrate = require('./migrate');

const dominoCollectionRequestOptions = {
    protocol: 'https:',
    host: 'dom01d.toronto.ca',
    port: 443,
    path: '/inter/cmo/staffhumanrights.nsf/api/data/collections/name/export'
};

const count = 100;

const page = 0;

const dominoCollectionDataFilter = (data) => data;

const dominoDetailRequestOptions = {
    protocol: 'https:',
    host: 'dom01d.toronto.ca',
    port: 443,
    path: '/inter/cmo/staffhumanrights.nsf/api/data/documents/unid'
};

const dominoDetailDataFilter = (data) => data;

const dominoBaseRequestOptions = {
    protocol: 'https:',
    host: 'dom01d.toronto.ca',
    port: 443,
    path: '/inter/cmo/staffhumanrights.nsf'
};

const uploadServiceRequestOptions = {
    protocol: 'https:',
    host: 'maserati.corp.toronto.ca',
    port: 49097,
    path: '/c3api_upload/upload/human_rights/ref'
};

const valueMapFromDominoToDataaccess = (data) => {
    const uploadedFiles = [];

    return Promise.resolve().then(() => {
        const detailId = migrate.convertToString(data['@unid']);
        const attNames = migrate.convertToArray(data['attNames']);

        if (attNames) {
            return attNames.reduce((promise, fileName, index, array) => {
                return promise.then(() => {
                    return migrate.migrateFile({ dominoBaseRequestOptions, detailId, fileName, uploadServiceRequestOptions }).then((data) => {
                        uploadedFiles[index] = {
                            name: data.BIN_ID[0].file_name,
                            type: data.type,
                            size: data.size,
                            bin_id: data.BIN_ID[0].bin_id,
                            status: 'success'
                        };
                    }, (error) => {
                        console.log('ERROR BYPASSED', error);
                    });
                });
            }, Promise.resolve()).then(() => { });
        }
    }).then(() => {
        return {
            'Created': migrate.convertToDate(data.Year),
            'first_name': migrate.convertToString(data.fName),
            'last_name': migrate.convertToString(data.LName),
            'uploadedFiles': uploadedFiles
        }
    });
};

const dataaccessRequestOptions = {
    protocol: 'https:',
    host: 'config.cc.toronto.ca',
    port: 49093,
    path: '/c3api_data/v2/DataAccess.svc/experiment/hr4'
}

console.log('MIGRATION BEGINS');

migrate.migrate({
    dominoCollectionRequestOptions,
    count,
    page,
    dominoCollectionDataFilter,
    dominoDetailRequestOptions,
    dominoDetailDataFilter,
    valueMapFromDominoToDataaccess,
    dataaccessRequestOptions
}).then(() => {
    console.log('MIGRATION ENDS');
}, (error) => {
    console.log('MIGRATE ERROR', error);
});

function transformRepeatControl(data) {
    var repArray = [{
        'add_firstName': data.A2FName, 'add_lastName': data.A2LName,
        'add_title': data.A2Title, 'add_role': data.A2Role, 'add_roleOther': data.A2RoleOther,
        'add_phone': data.A2Phone, 'add_altPhone': data.A2PhoneAlt, 'add_address': multiTransform(data.A2Address, ' '),
        'add_email': data.A2Email, 'add_cityEmployee': data.A2Emp, 'add_cotEmployeeType': setEmpType(data.A2EmpType),
        'add_cotJobType': setJobType(data.A2JobType), 'add_cotDivision': setDivision(data.A2Division)
    },
    {
        'add_firstName': data.A3FName, 'add_lastName': data.A3LName,
        'add_title': data.A3Title, 'add_role': data.A3Role, 'add_roleOther': data.A3RoleOther,
        'add_phone': data.A3Phone, 'add_altPhone': data.A3PhoneAlt, 'add_address': multiTransform(data.A3Address, ' '),
        'add_email': data.A3Email, 'add_cityEmployee': data.A3Emp, 'add_cotEmployeeType': setEmpType(data.A3EmpType),
        'add_cotJobType': setJobType(data.A3JobType), 'add_cotDivision': setDivision(data.A3Division)
    },
    {
        'add_firstName': data.A4FName, 'add_lastName': data.A4LName,
        'add_title': data.A4Title, 'add_role': data.A4Role, 'add_roleOther': data.A4RoleOther,
        'add_phone': data.A4Phone, 'add_altPhone': data.A4PhoneAlt, 'add_address': multiTransform(data.A4Address, ' '),
        'add_email': data.A4Email, 'add_cityEmployee': data.A4Emp, 'add_cotEmployeeType': setEmpType(data.A4EmpType),
        'add_cotJobType': setJobType(data.A4JobType), 'add_cotDivision': setDivision(data.A4Division)
    }
    ];
    return repArray;
}