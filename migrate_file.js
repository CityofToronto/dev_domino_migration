const migrate = require('./migrate');

const dominoBaseRequestOptions = {
    protocol: 'https:',
    host: 'dom01d.toronto.ca',
    port: 443,
    path: '/inter/cmo/staffhumanrights.nsf'
};

const detailId = 'E7684EC2CC915C588525841E0070200A';

const fileName = 'SW Addendum.pdf';

const uploadServiceRequestOptions = {
    protocol: 'https:',
    host: 'maserati.corp.toronto.ca',
    port: 49097,
    path: '/c3api_upload/upload/human_rights/ref'
};

migrate.migrateFile({ dominoBaseRequestOptions, detailId, fileName, uploadServiceRequestOptions }).then(() => {
    console.log('MIGRATION ENDS');
}, (error) => {
    console.log('MIGRATE ERROR', error);
});