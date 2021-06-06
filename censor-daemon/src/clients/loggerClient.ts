import winston from 'winston';

const myFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `{ timestamp: ${timestamp}, level: ${level}, message: ${message} }`;
  });
  
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.timestamp(), myFormat),
	transports: [
        new winston.transports.Console({})
	]
});

function promiseLogerWrapper(promise: Promise<any>, type: 'Error' | 'Info' | 'Warning'): Promise<any> {
	return promise.catch(fromReject => {
		switch (type) {
			case 'Error':
				logger.error(`Error: ${ typeof fromReject  === "object" ? JSON.stringify(fromReject) : fromReject}, Stack: ${fromReject.stack}`);
				break;
			case 'Info':
				logger.info(JSON.stringify(fromReject));
				break;
			case 'Warning':
				logger.warning(JSON.stringify(fromReject));
				break;
		}
		
		return fromReject;
	});
}

export { logger, promiseLogerWrapper };