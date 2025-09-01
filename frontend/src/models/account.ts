import * as _ from 'lodash';
import { universities, promotions, paymentTypes } from "../assets/lists";

export class Account {
    id : number;
    isInRadius: boolean;
    admin: boolean;
    prenom : string | null;  
    nom : string | null;
    login: string; // | null;
    password : string | null;
    email: string | null;
    emailIsVerified: boolean;
    room: string | null;
    university: string;
    promotion: string;
    t1Paid: boolean;
    t1PaymentType: string;
    t1PaidAt: Date | null;
    t2Paid: boolean;
    t2PaymentType: string;
    t2PaidAt: Date | null;
    t3Paid: boolean;
    t3PaymentType: string;
    t3PaidAt: Date | null;
    createdAt: Date | null;
    message : string | null;

    constructor(data : any) {
      this.id = data.id;
      this.isInRadius = data.isInRadius !== undefined ? data.isInRadius : false;
      this.admin = data.is_admin !== undefined ? data.is_admin : false;
      this.prenom = data.prenom || null;
      this.nom = data.nom || null;
      this.login = data.uid ;//|| null;
      this.password = data.password || null;
      this.email = data.email || null;
      this.emailIsVerified = data.emailIsVerified !== undefined ? data.emailIsVerified : false;
      this.room = data.room || null;
      this.university =  data.university !== undefined ? (universities.includes(data.university) ? data.university : universities[0]) : universities[0];
      this.promotion = data.promotion !== undefined ? (promotions.includes(data.promotion) ? data.promotion : promotions[0]) : promotions[0];
      this.t1PaymentType = data.t1PaymentType !== undefined ? (paymentTypes.includes(data.t1PaymentType) ? data.t1PaymentType : paymentTypes[0]) : paymentTypes[0];
      this.t1Paid = data.t1PaidAt ? true : false;
      this.t1PaidAt = data.t1PaidAt ? new Date(data.t1PaidAt) : null;
      this.t2Paid = data.t2PaidAt ? true : false;
      this.t2PaymentType = data.t2PaymentType !== undefined ? (paymentTypes.includes(data.t2PaymentType) ? data.t2PaymentType : paymentTypes[0]) : paymentTypes[0];
      this.t2PaidAt = data.t2PaidAt ? new Date(data.t2PaidAt) : null;
      this.t3Paid = data.t3PaidAt ? true : false;
      this.t3PaymentType = data.t3PaymentType !== undefined ? (paymentTypes.includes(data.t3PaymentType) ? data.t3PaymentType : paymentTypes[0]) : paymentTypes[0];
      this.t3PaidAt = data.t3PaidAt ? new Date(data.t3PaidAt) : null;
      this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
      this.message = data.message || null; // Format : First character is E (for Error) or S (for Success)
    }

    differenceWith(otherAccount : Account | undefined) {
      if (otherAccount === undefined) return {}
      else {
        var diff = {};
        Object.keys(this)
          .filter(key => key !== "message") // Don't want comparaison on the message field
          .forEach(
            key => {if (!_.isEqual((this as any)[key], (otherAccount as any)[key])) (diff as any)[key] = (this as any)[key]}
          )
        return diff
      }
    }

    get(parameter : string) : any {
      return this[parameter as keyof Account]
    }

    simpleChange(parameter: string, newVal : any) {
      (this as any)[parameter] = newVal
    }
 
    complexChange(parameter: string, newVal : any) {
      this.simpleChange(parameter, newVal);
      if (parameter[0] === "t") { // Change on a trimester
        const trimesterPrefix = parameter.slice(0,2);
        const trimesterSuffix = parameter.slice(2);
        const today = new Date((new Date()).toISOString().split('T')[0]);
        switch (trimesterSuffix) {
          case "Paid" : {
            this.simpleChange(trimesterPrefix + "PaidAt",  newVal ? today : null);
            this.simpleChange(trimesterPrefix + "PaymentType", paymentTypes[newVal ? 1 : 0]);
            break;
          }
          case "PaidAt" : {
            if (newVal === null) {
              this.simpleChange(trimesterPrefix + "Paid", false);
              this.simpleChange(trimesterPrefix + "PaymentType", paymentTypes[0]);
            } else {
              this.simpleChange(trimesterPrefix + "Paid", true);
              if (this.get(trimesterPrefix + "PaymentType") === paymentTypes[0]) this.simpleChange(trimesterPrefix + "PaymentType", paymentTypes[1])
            }
            break;
          }
          case "PaymentType" : {
            if (newVal === paymentTypes[0]) {
              this.simpleChange(trimesterPrefix + "Paid", false);
              this.simpleChange(trimesterPrefix + "PaidAt",  null);
            } else {
              this.simpleChange(trimesterPrefix + "Paid", true);
              this.simpleChange(trimesterPrefix + "PaidAt",  today);
            }
            break;
          }
        }
      }
    }


}


 