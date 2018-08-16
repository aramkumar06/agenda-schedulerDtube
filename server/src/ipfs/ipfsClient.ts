import * as ipfsAPI from 'ipfs-api';
import logger from "../util/logger";

class IPFSClient {
    private static gateway = 'ipfs.infura.io';
    // private static gateway = 'mainnet.infura.io/v3/9daffda3594b4eec938f4a2e122d02cd';
    // TODO: Implement Infura IPFS Gateway with API key etc.
    private ipfs;

    public async connect() {
        this.ipfs = ipfsAPI(IPFSClient.gateway, '5001', {protocol: 'https'});
        logger.log('IPFS Connected');
    }

    public add(buffer): Promise<any> {
        return new Promise<any>( (res, rej) => {
            this.ipfs.files.add(buffer, (err, file) => {
                err ? rej(err):res(file[0]);
            });
        });
    }
}

let IpfsClient = new IPFSClient();
export default IpfsClient;