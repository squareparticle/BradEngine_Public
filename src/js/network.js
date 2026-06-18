class Network{

    constructor(callback){
        this.lastPeerId = null;
        this.peer = null; // Own peer object
        this.serverID = '';
        this.connToServer = null;
        this.clientList = {};
        this.status = '';
        this.callback=callback;
    }

    getConnectedPeerID(){
        var clientKeys = Object.keys(this.clientList);
        if(clientKeys.length===1) return clientKeys[0];
        if(this.serverID) return this.serverID;
        return '';
    }

    setStatus(msg){
        this.status = msg;
        console.log('Network Status:'+msg);
    }

    showServerConnectionsToLog(){
        var msg = 'ClientList: Awaiting connection...';
        if (Object.keys(this.clientList).length) msg = "ClientList: Connected: ";
        for (var key in this.clientList) { msg += key +" "; }
        this.setStatus(msg);
    }

    startConnection(isServer, stunServer) {
        if(typeof META !=='undefined' && META.NETWORK){
            if(META.NETWORK.IS_SERVER)
                isServer = META.NETWORK.IS_SERVER;
            if(META.NETWORK.STUN_SERVER)
                stunServer = META.NETWORK.STUN_SERVER;
        }

        this.isServer = isServer;
        this.stunServer = stunServer;

        this.peer = new Peer(null, this.stunServer);

        this.peer.on('open', id => {
            // Workaround for peer.reconnect deleting previous id
            if (this.peer.id === null) {
                this.setStatus('Peer Open: Received null id from peer open');
                this.peer.id = this.lastPeerId;
            } else {
                this.lastPeerId = this.peer.id;
            }
            if(this.isServer){
                this.postSignal(this.peer.id, 'offer');
                this.setStatus('Peer Open: Server: ID: ' + this.peer.id);
                this.setStatus("Peer Open: Server: Awaiting connection...");                
            }
            else{
                this.setStatus('Peer Open: Client: ID: ' + this.peer.id);
                this.getSignal();
            }
        });
        this.peer.on('connection', c => {
            // Allow only a single connection
            if (this.clientList[c.peer] && this.clientList[c.peer].open) {
                c.on('open', function() {
                    c.send("Already connected to another client");
                    setTimeout(function() { c.close(); }, 500);
                });
                return;
            }

            if(this.isServer){
                this.clientList[c.peer] = c;
                this.showServerConnectionsToLog();        
                this.setStatus("Peer Connection: Server : connected to: " + c.peer);
                this.clientConnected(c.peer);
                // setInterval(function(){ 
                //     console.log('sending hi');
                //     c.send('hi '+c.peer);
                // }, 500);        
                // c.send('hi '+c.peer);
            }
        });

        this.peer.on('disconnected', ()=> {
            this.setStatus('Peer: Connection lost: Please reconnect');

            // Workaround for peer.reconnect deleting previous id
            this.peer.id = this.lastPeerId;
            this.peer._lastServerId = this.lastPeerId;
            this.peer.reconnect();
        });
        this.peer.on('close', () => {
            if(this.isServer){
                for (var key in this.clientList) {
                    this.clientList[key]=null;
                    delete this.clientList[key];
                }
            }
            else{
                this.connToServer = null;
            }
            this.setStatus("Peer: Close: Connection destroyed. Please refresh");
        });
        this.peer.on('error', err => {
            this.setStatus("Peer: error: " + err); 
            alert('' + err);
        });
    };

    clientConnected(peerID) {

        this.clientList[peerID].on('data', data=> {
            this.callback(data);
            //console.log("From: "+peerID+':'+data);
            //this.clientList[peerID].send('Hello from '+peerID);
        });

        this.clientList[peerID].on('close', ()=> {
            this.setStatus("Connection reset<br>Awaiting connection...");
            this.clientList[peerID] = null;
            delete this.clientList[peerID];
            this.showServerConnectionsToLog(); 
        });

        this.clientList[peerID].on('error', (err)=> {
            this.setStatus('Server: Conn: Error: connection error: '+peerID+":"+err);
        });
    }

    join(signalID) {
        // Close old connection
        if (this.connToServer) {
            this.connToServer.close();
        }

        // Create connection to destination peer specified in the input field
        this.connToServer = this.peer.connect(signalID, {
            reliable: true
        });
        this.connToServer.on('open', ()=> {
            this.serverID = signalID;
            this.setStatus("Join: Open: Connected to ServerID: " + this.connToServer.peer);
            // setInterval(function(){ 
            //     console.log('sending hi');
            //     conn.send('sendData'); 
            // }, 100);
            // this.connToServer.send('hi from '+this.connToServer.peer);
        });
        // Handle incoming data
        this.connToServer.on('data', data=> {
            this.callback(data);
            // console.log("From Server: "+data);
        });
        this.connToServer.on('close', ()=> {
            this.setStatus("Connection closed");
        });
    };


    sendToServer(data){
        if(this.connToServer)
            this.connToServer.send(data);
    }

    sendToAllClients(data){
        for (var key in this.clientList) { 
            this.clientList[key].send(data);
        }
    }

    getSignal(){
        axios.get('https://bzinc0fun8.execute-api.us-east-1.amazonaws.com/default/WebRTC?userID=Brad&type=offer')
        .then(response => {
            //console.log('peer',this.peer)
            var hostSignal = response.data;
            this.join(hostSignal)
            this.setStatus('Getting Offer from Lambda:'+response.data);
        })
        .catch(error=> {
            this.setStatus('getSignal: Error: '+error);
        });
    }

    postSignal(signal, type){
        console.log('Posting to Lambda:' + signal);
        axios.post('https://bzinc0fun8.execute-api.us-east-1.amazonaws.com/default/WebRTC', {
            userID: 'Brad',
            type, signal
        })
        .then(response=> {
            this.setStatus('postSignal: Success: ');
        })
        .catch(error=> {
            this.setStatus('postSignal: Error: '+error);
        });
    }
}

// // Send message
// sendButton.addEventListener('click', function () {
//     if (conn && conn.open) {
//         var msg = sendMessageBox.value;
//         sendMessageBox.value = "";
//         conn.send(msg);
//         console.log("Sent: " + msg)
//         addMessage("<span class=\"selfMsg\">Self: </span>" + msg);
//     } else {
//         console.log('Connection is closed');
//     }
// });