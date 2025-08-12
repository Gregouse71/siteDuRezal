import { universities, promotions, paymentTypes } from "../assets/lists";
import httpInstance from "./api";

export default function useAccountService() {
    
    
    const defaultValueOfAccountField = (fieldName : string) => {
      switch(fieldName) {
        case "id" : return ""
        case "isInRadius" : return false
        case "admin" : return false
        case "firstName" : return ""
        case "lastName" : return ""
        case "login" : return ""
        case "password" : return ""
        case "email" : return ""
        case "emailIsVerified" : return false
        case "room" : return ""
        case "university" : return universities[0]
        case "promotion" : return promotions[0]
        case "t1Paid" : return false
        case "t1PaymentType" : return paymentTypes[0]
        case "t1PaidAt" : return ""
        case "t2Paid" : return false
        case "t2PaymentType" : return paymentTypes[0]
        case "t2PaidAt" : return ""
        case "t3Paid" : return false
        case "t3PaymentType" : return paymentTypes[0]
        case "t3PaidAt" : return ""
        case "createdAt" : return null
        default : return undefined
      }
    }

    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const pwdLen = 10;

    const createPassword = () => {
      return Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('')
    }

    const register = (registrationInfos : any) => {
      return new Promise<number>((resolve, reject) => {
          httpInstance.post("register", registrationInfos)
          .then((idGiven : any) => {
              resolve(idGiven);
          })
          .catch(error => reject(error))
      })
  }

  const emailVerification = (verificationInfos : any) => {
      return new Promise<void>((resolve, reject) => {
          httpInstance.post("verify_email", verificationInfos)
          .then(() => resolve())
          .catch(error => reject(error))
      })
  }
     
  return {
      defaultValueOfAccountField : defaultValueOfAccountField,
      createPassword : createPassword,
      register : register,
      emailVerification : emailVerification,
  }
}

