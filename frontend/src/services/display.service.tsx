import { Button } from "@mui/material";
import _ from "lodash";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { universities, promotions, paymentTypes } from "../assets/lists";
import { Account } from "../models/account";
import { databaseAccountsState } from "./admin.service";
import useConversionService from "./conversion.service";
import { useDateService } from "./date.service";


export default function useDisplayService() {

    const dateService = useDateService();
    const conversionService = useConversionService();

    const isTrimester = (field: string) => ["t", "T"].includes(field[0]) || ["cotizT1", "cotizT2", "cotizT3"].includes(field) 
    
    const AccountFieldDisplay = (props : any) => {

      const [value, setValue] = useState(props.value);
      const [field, setField] = useState(props.field);
      const [isValueValid, setIsValueValid] = useState(true);
      const dateService = useDateService();

      useEffect(() => {
          setValue(props.value);
          setField(props.field);
      }, [props.value, props.field]);

      const onValueChange = (newValue : any) => props.onValueChange(field, newValue);
  
      const StringInput = () => <input 
          type="text"
          value={value}
          onChange={(event) => {setValue(event.target.value)}}
          onKeyDown={(event) => {if (event.key === "Enter") onValueChange(value)}}
          onBlur={(event) => {onValueChange(event.target.value)}}
      />

      const DateInput = () => <input 
          type="text"
          pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}"
          placeholder="Format : JJ/MM/AAAA"
          style={{borderColor : isValueValid ? "" : "red"}}
          value={value}
          onChange={(event) => {setValue(event.target.value); setIsValueValid(event.target.validity.valid)}}
          onKeyDown={(event) => {if (event.key === "Enter" && isValueValid) onValueChange(dateService.stringToDate(value))}}
          onBlur={(event) => {
            if (isValueValid) onValueChange(dateService.stringToDate(event.target.value))
            else if (event.target.value === "") onValueChange(null)
            else {setValue(props.value); setIsValueValid(true)}
          }}
      />
  
      const createOptionsForLists = (list : Array<string>) => {
          const listComputed = list.map(el => <option key={"filter value choice " + el} value={el}> {el} </option>)
          return <select value={value} onChange={(event) => onValueChange(event.target.value)}> 
              {listComputed} 
          </select>
      }
  
      const BinaryList = () => <select value={String(value)} onChange={(event) => onValueChange(event.target.value === "true")}> 
          <option value="true"> Oui </option>
          <option value="false"> Non </option>
      </select>

      const valueUnmutable = <span>
        {value?.toString()}
      </span>

      const MessageDisplay = () => {
        const message = value;
        if (message === null) return <span></span>
        else return <span style={{color : value[0] === "S" ? "green" : "red"}}>
            {value !== null ? value.slice(1) : ""}
        </span>
      }
  
      switch(field) {
          case "id" : return valueUnmutable
          case "isInRadius" : return props.mutable ? BinaryList() : valueUnmutable
          case "is_admin" : return props.mutable ? BinaryList() : valueUnmutable
          case "prenom" : return props.mutable ? StringInput() : valueUnmutable
          case "nom" : return props.mutable ? StringInput() : valueUnmutable
          case "uid" : return props.mutable ? StringInput() : valueUnmutable
          case "password" : return props.mutable ? StringInput() : valueUnmutable
          case "email" : return props.mutable ? StringInput() : valueUnmutable
          case "emailIsVerified" : return props.mutable ? BinaryList() : valueUnmutable
          case "room" : return props.mutable ? StringInput() : valueUnmutable
          case "university" : return props.mutable ? createOptionsForLists(universities) : valueUnmutable
          case "promotion" : return props.mutable ? createOptionsForLists(promotions) : valueUnmutable
          case "cotizT1" : return props.mutable ? BinaryList() : valueUnmutable
          case "t1PaymentType" : return props.mutable ? createOptionsForLists(paymentTypes) : valueUnmutable
          case "t1PaidAt" : return props.mutable ? (props.imposeDateFormat ? DateInput() : StringInput()) : valueUnmutable
          case "cotizT2" : return props.mutable ? BinaryList() : valueUnmutable
          case "t2PaymentType" : return props.mutable ? createOptionsForLists(paymentTypes) : valueUnmutable
          case "t2PaidAt" : return props.mutable ? (props.imposeDateFormat ? DateInput() : StringInput()) : valueUnmutable
          case "cotizT3" : return props.mutable ? BinaryList() : valueUnmutable
          case "t3PaymentType" : return props.mutable ? createOptionsForLists(paymentTypes) : valueUnmutable
          case "t3PaidAt" : return props.mutable ? (props.imposeDateFormat ? DateInput() : StringInput()) : valueUnmutable
          case "createdAt" : return props.mutable ? (props.imposeDateFormat ? DateInput() : StringInput()) : valueUnmutable 
          case "message" : return MessageDisplay()
          default : <></>
          
      }
      return <></>
    }   

    const FieldsDisplayTab = (props : any) => {
        const changeStatusDisplayOfField = (field : string) => props.setFieldData({...props.fieldsData, [field] : !props.fieldsData[field]});
    
        return <>
            <h2> Champs affichés </h2>
            <div id="field-choice-list">
                <table className="table table-bordered table-striped table-sm" style={{textAlign : "center"}}>
                    <thead><tr>{Object.keys(props.fieldsData).map(fieldName => {return <th key={"head " + fieldName}><p>{conversionService.translateAccountFieldNameInFrench(fieldName)} ({fieldName})</p></th>})}</tr></thead>
                    <tbody><tr>{Object.keys(props.fieldsData).map(fieldName => <th key={"body " + fieldName}><Button style={{margin : "auto"}} variant="outlined" color={props.fieldsData[fieldName] ? "success" : "error"} onClick={() => changeStatusDisplayOfField(fieldName)}/></th>)}</tr></tbody>
                </table>
            </div>
        </>

    }

    const UserAdminDisplay= (props : any) => {

        const [account, setAccount] = useState<Account>(props.account);
        const databaseAccount = useRecoilValue(databaseAccountsState).get(account.id);
        const [fieldDisplayData,setFieldDisplayData] = useState(props.fieldsData);
    
        useEffect(() => {
            setAccount(props.account);
            setFieldDisplayData(props.fieldsData);
        }, [props.account, props.fieldsData]);
    
        const FieldDisplayedWithComponent = (innerProps : any) => {
            const isTrimesterField = isTrimester(innerProps.field);
            const databaseAccountFieldValue = dateService.tranformToDateIfPossible(databaseAccount?.get(innerProps.field));
            const accountFieldValue = dateService.tranformToDateIfPossible(account.get(innerProps.field));
            const backgroundColor = props.highlightChangesRespectedToDatabaseAccount ? ((databaseAccount && !_.isEqual(databaseAccountFieldValue, accountFieldValue)) ? "orange" : "") : "";
            return <>
                {fieldDisplayData[isTrimesterField ? ("T" + innerProps.field[1]) : innerProps.field] && 
                <td style={{backgroundColor : backgroundColor}}>
                    <AccountFieldDisplay
                        value={accountFieldValue}
                        field={innerProps.field}
                        mutable={props.mutable}
                        imposeDateFormat={true}
                        onValueChange={props.onValueChange}
                    />
                </td>}
            </>
        }
    
    
        return <>
            {props.hasSelectionColumn && <td>
                <input type="checkbox" checked={props.IdsSelected.includes(account.id)} onChange={props.onSelectAccount} />
            </td>}
            {conversionService
                .accountFieldsNameInEnglish
                .map(field => <FieldDisplayedWithComponent key={"account " + account.id + " field " + field} field={field} />)    
            }
            <td>
                {account.id !== -1 && <button className="btn btn-error" onClick={props.onDeleteAccount}> Supprimer </button>}
            </td>
        </>
    }

    const UsersTab = (props : any) => {
        const [fieldDisplayData, setFieldsData] = useState(props.fieldsData);
        const [users, setUsers] = useState<Account[]>(props.users);

        useEffect(() => {
            setFieldsData(props.fieldsData);
            setUsers(props.users); 
        }, [props.fieldsData, props.users])

        const TableHeadFirstRow = () => {
            const selectionHead = <th rowSpan={2}><input type="checkbox" checked={props.areAllIdsSelected} onChange={props.onSelectAll}/></th> 
            const rowElements = Object.keys(fieldDisplayData).map(
                fieldName => {
                    const isTrimesterField = isTrimester(fieldName);
                    if (isTrimesterField) {
                        return fieldDisplayData[fieldName] && <th key={"User head " + fieldName} colSpan={3}>{conversionService.translateAccountFieldNameInFrench(fieldName)}</th>
                    } else {
                        return fieldDisplayData[fieldName] && <th key={"User head " + fieldName} rowSpan={2}>{conversionService.translateAccountFieldNameInFrench(fieldName)}</th>
                    }
                }
            )
            const actionsHead = <th rowSpan={2}>Actions</th> 

            if (props.hasSelectionColumn) return [selectionHead, ...rowElements, actionsHead]
            else return [...rowElements, actionsHead]
        }
        
        const TableHeadSecondRow = conversionService.accountFieldsNameInEnglish.map(
            fieldName => {
                const isTrimesterField = isTrimester(fieldName);
                return <>
                    {isTrimesterField && fieldDisplayData["T" + fieldName[1]] && <th key={"User head " + fieldName} >
                        {conversionService.translateAccountFieldNameInFrench(fieldName)}
                    </th>}
                </>
        })

        return <>
        <table className="table table-bordered table-striped table-sm table-editable" style={{textAlign : "center"}}> 
            <thead className="align-middle">   
                <tr>
                    {TableHeadFirstRow()}
                </tr>
                <tr>
                    {TableHeadSecondRow}
                </tr>
            </thead>
            <tbody className="align-middle">
                {users.length === 0 && <tr></tr>}
                {users.map(
                    account => <tr key={"Account " + account.id}  >
                        <UserAdminDisplay
                            account={account} 
                            hasSelectionColumn={props.hasSelectionColumn}
                            IdsSelected={props.IdsSelected}
                            fieldsData={fieldDisplayData}
                            mutable={props.mutable}
                            onValueChange={(field : string, newValue : any) => props.onAccountValueChange(account.id, field, newValue)}
                            onDeleteAccount={() => props.onDeleteAccount(account.id)}
                            onSelectAccount={() => props.onSelectAccount(account.id)}
                            highlightChangesRespectedToDatabaseAccount={props.highlightChangesRespectedToDatabaseAccount}
                            />
                    </tr>
                )}
            </tbody>
        </table>
        </>
    }

    return {
        isTrimesterField : isTrimester,
        AccountFieldDisplay : AccountFieldDisplay,
        FieldsDisplayTab : FieldsDisplayTab,
        UserAdminDisplay : UserAdminDisplay,
        UsersTab : UsersTab
    }

}