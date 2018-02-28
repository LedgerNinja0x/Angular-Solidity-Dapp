import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service'

const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');
const contract = require('truffle-contract');

@Injectable()
export class MetaCoinService {

	MetaCoin = contract(metaincoinArtifacts);

  constructor(
  	private web3Ser: Web3Service,
  	) { 
  	// Bootstrap the MetaCoin abstraction for Use
  	this.MetaCoin.setProvider(web3Ser.web3.currentProvider);
  }

  GetBalance(account): Observable<number> {
  	let meta;

  	return Observable.create(observer => {
  		this.MetaCoin
  		  .deployed()
  		  .then(instance => {
  		    meta = instance;
  		    return meta.getBalance.call(account, {
  		      from: account
  		    });
  		  })
  		  .then(value => {
  		    observer.next(value)
  		    observer.complete()
  		  })
  		  .catch(e => {
  		    console.log(e);
  		    observer.error(e)
  		  });
  	})
  }

  SendCoin(from, to, amount): Observable<any>{
  	let meta;
  	return Observable.create(observer => {
  	  this.MetaCoin
  	    .deployed()
  	    .then(instance => {
  	      meta = instance;
  	      return meta.sendCoin(to, amount, {
  	        from: from
  	      });
  	    })
  	    .then(() => {
  	      observer.next()
  	      observer.next()
  	    })
  	    .catch(e => {
  	      observer.error(e)
  	    });
  	})
  }

}
