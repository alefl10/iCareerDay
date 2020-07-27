const { Client, logger, Variables, File } = require('camunda-external-task-client-js');
const superagent = require('superagent');

const config = {
	baseUrl: 'http://localhost:8080/engine-rest',
	use: logger,
};

// TOPICS
const INVITE_COMPANY = 'INVITE_COMPANY';
const COMPANY_RESPONSE = 'COMPANY_RESPONSE';
const PROCESS_QR_CODE = 'PROCESS_QR_CODE';
const SEND_QR_CODE = 'SEND_QR_CODE';
const DIGITAL_CAREER_DAY_EVENT_DATE = 'DIGITAL_CAREER_DAY_EVENT_DATE';
const VISIT_COMPANY_DESK = 'VISIT_COMPANY_DESK';
const EXPOSE_PROPOSALS = 'EXPOSE_PROPOSALS';
const UPLOAD_RESUME = 'UPLOAD_RESUME';
const AWS_RESUME_UPLOAD = 'AWS_RESUME_UPLOAD';
const SUPPORT_REQUIRED = 'SUPPORT_REQUIRED';
const GIVE_SUPPORT = 'GIVE_SUPPORT';
const PROVIDE_EVENT_FEEDBACK = 'PROVIDE_EVENT_FEEDBACK';
const SEND_RESUME_NOTIFICATIONS = 'SEND_RESUME_NOTIFICATIONS';

const client = new Client(config);

const inviteCompany = async ({ task, taskService }) => {
	console.log('INVITE_COMPANY');
	superagent
		.post(`${config.baseUrl}/message`)
		.send({
			messageName: 'InvitationRequest',
			businessKey : '1',
		})
		.then(async res => {
			console.log('Sent Digital Career Day invitation to company');
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};

const companyResponse = async ({ task, taskService }) => {
	console.log('COMPANY_RESPONSE');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'InvitationResponse', 
				businessKey: '1',
			}
		)
		.then(async res => {
			const processVariables = new Variables();
			processVariables.set('dcdResponse', true);
			processVariables.set('companyName', 'Apple');
			console.log('Company accepted Digital Career Day invitation');
			await taskService.complete(task, processVariables);
		})
		.catch(error => console.log(error));
};

const processQRCode = async ({ task, taskService }) => {
	console.log('PROCESS_QR_CODE');
	const processVariables = new Variables();
	const companyName = processVariables.get('companyName');
	processVariables.set('qrCode', `www.us.com/companies/${companyName}/qrcode`);
	console.log('Processing company QR Code')
	await taskService.complete(task, processVariables);
};

const sendQRCode = async ({ task, taskService }) => {
	console.log('SEND_QR_CODE');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'CompanyQRCode', 
				businessKey: '1',
			}
		)
		.then(async res => {
			console.log('Sent participating Company its associated QR Code');
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};

const communicateEventDate = async ({ task, taskService }) => {
	console.log('DIGITAL_CAREER_DAY_EVENT_DATE');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'DateConfirmation', 
				businessKey: '1',
			}
		)
		.then(async res => {
			const processVariables = new Variables();
			processVariables.set('eventName', 'TopTierTech');
			processVariables.set('eventDescription', 'Come meet the most prestigious and influential companies shaping the future of technology!');
			processVariables.set('eventDate', new Date().getDate());
			console.log('Communicated Students Digital Career Day Event\'s Date');
			await taskService.complete(task, processVariables);
		})
		.catch(error => console.log(error));
};

const visitCompanyDesk = async ({ task, taskService }) => {
	console.log('VISIT_COMPANY_DESK');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'InitiateEngagement', 
				businessKey: '1',
			}
		)
		.then(async res => {
			console.log('Student visited a company\'s desk and started engagement process');
			const processVariables = new Variables();
			processVariables.set('studentEngaged', true);
			await taskService.complete(task, processVariables);
		})
		.catch(error => console.log(error));
};

const exposeProposals = async ({ task, taskService }) => {
	console.log('EXPOSE_PROPOSALS');
	superagent
	.post(`${config.baseUrl}/message`)
	.send(
		{ 
			messageName: 'CompanyProposal', 
			businessKey: '1',
		}
		)
		.then(async res => {
			console.log('Company exposed proposal to a student');
			console.log('Student accepted company\'s proposal');
			const processVariables = new Variables();
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};
	
const uploadResume = async ({ task, taskService }) => {
	console.log('UPLOAD_RESUME');
	superagent
	.post(`${config.baseUrl}/message`)
	.send(
		{ 
			messageName: 'UploadResume', 
			businessKey: '1',
		}
		)
		.then(async res => {
			console.log('Student submitted resume for upload');
			const processVariables = new Variables();
			processVariables.set('firstName', 'John');
			processVariables.set('lastName', 'Doe');
			processVariables.set('email', 'john.doe@mail.polimi.it');
			await taskService.complete(task, processVariables);
		})
		.catch(async error => {
			// If there was an error uploading the resume we could catch it and throw the error here --> ResumeUploadError
			console.log(error)
			await taskService.handleBpmnError(task, "ResumeUploadError", "ERROR - Student could not upload resume successfully");
		});
};
	
const awsResumeUpload = async ({ task, taskService }) => {
	console.log('AWS_RESUME_UPLOAD');
	console.log('Student\'s resume was successfully uploaded to AWS S3');
	const processVariables = new Variables();
	processVariables.set('firstName', 'John');
	processVariables.set('lastName', 'Doe');
	processVariables.set('email', 'john.doe@mail.polimi.it');
	processVariables.set('resume', 'not_reviewed');
	await taskService.complete(task, processVariables);
};

const requestSupport = async ({ task, taskService }) => {
	console.log('SUPPORT_REQUIRED');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'ResumeUploadSupport', 
				businessKey: '1',
			}
		)
		.then(async res => {
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};

const giveSupport = async ({ task, taskService }) => {
	console.log('GIVE_SUPPORT');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'ReceiveSupport', 
				businessKey: '1',
			}
		)
		.then(async res => {
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};

const provideEventFeeback = async ({ task, taskService }) => {
	console.log('PROVIDE_EVENT_FEEDBACK');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'EventFeedback', 
				businessKey: '1',
				all: true, // Allows to send the same message to multiple running process instances
			}
		)
		.then(async res => {
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};

const sendResumeNotifications = async ({ task, taskService }) => {
	console.log('SEND_RESUME_NOTIFICATIONS');
	superagent
		.post(`${config.baseUrl}/message`)
		.send(
			{ 
				messageName: 'ResumeNotifications', 
				businessKey: '1',
			}
		)
		.then(async res => {
			console.log('iCareerEvent Process was completed successfully!')
			await taskService.complete(task);
		})
		.catch(error => console.log(error));
};


// SUBSCRIPTIONS
client.subscribe('INVITE_COMPANY', inviteCompany );
client.subscribe('COMPANY_RESPONSE', companyResponse);
client.subscribe('PROCESS_QR_CODE', processQRCode);
client.subscribe('SEND_QR_CODE', sendQRCode);
client.subscribe('DIGITAL_CAREER_DAY_EVENT_DATE', communicateEventDate);
client.subscribe('VISIT_COMPANY_DESK', visitCompanyDesk);
client.subscribe('EXPOSE_PROPOSALS', exposeProposals);
client.subscribe('UPLOAD_RESUME', uploadResume);
client.subscribe('AWS_RESUME_UPLOAD', awsResumeUpload);
client.subscribe('SUPPORT_REQUIRED', requestSupport);
client.subscribe('GIVE_SUPPORT', giveSupport);
client.subscribe('PROVIDE_EVENT_FEEDBACK', provideEventFeeback);
client.subscribe('SEND_RESUME_NOTIFICATIONS', sendResumeNotifications);