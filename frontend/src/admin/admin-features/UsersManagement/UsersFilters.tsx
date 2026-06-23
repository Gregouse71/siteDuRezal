import { Button, Table } from "@mui/material";
import { useState, useEffect } from "react";
import useAccountService from "../../../services/account.service";
import useConversionService from "../../../services/conversion.service";
import useDisplayService from "../../../services/display.service";

export const defaultFilterName = "-";
const defaultFilter = {value : null, inverted : false};

function FilterFieldNameSelection(props : any) {

    const conversionService = useConversionService();
    const [filterFieldName, setFilterFieldName] = useState(props.filterFieldName);
    const [allFilterFieldNames, setAllFilterFieldNames] = useState(props.allFilterFieldNames);

    useEffect(() => {
        setFilterFieldName(props.filterFieldName);
        setAllFilterFieldNames(props.allFilterFieldNames);
    }, [props.filterFieldName, props.allFilterFieldNames]);

    const possibleChoicesFieldName = conversionService.accountFieldsNameInEnglishWithoutPassword
        .filter(fieldName => !allFilterFieldNames.includes(fieldName))
        .map(fieldName => <option 
            key = {"choice filter name " + fieldName}
            value={fieldName}> 
                {conversionService.translateAccountFieldNameInFrench(fieldName)} 
    </option>)

    return <select value={filterFieldName} onChange={(event) => props.setUserFilterName(filterFieldName, event.target.value)}>
        {<option value={filterFieldName}>{conversionService.translateAccountFieldNameInFrench(filterFieldName)} </option>}
        {possibleChoicesFieldName}
    </select>

}

export default function UsersFilters(props : any) {
    
    const accountService = useAccountService();
    const conversionService = useConversionService();
    const displayService = useDisplayService();
    const [userFilters, setUserFilters] = useState(props.userFilters);

    useEffect(() => {
        setUserFilters(props.userFilters);
    }, [props.userFilters]);

    const deleteUserFilter = (fieldName : string) => {
        const newUserFilters = userFilters;
        delete newUserFilters[fieldName];
        props.setUserFilters({...newUserFilters});
    }

    const setUserFilterName = (oldFieldName : string, newFieldName : string) => {
        const newUserFilters = userFilters;
        delete newUserFilters[oldFieldName];
        props.setUserFilters({
            ...newUserFilters,  
            [conversionService.translateAccountFieldNameInEnglish(newFieldName)] : {
                value : accountService.defaultValueOfAccountField(newFieldName),
                inverted : false
            }
        });
    }

    const setFilterValue = (field : string, newValue : any) => {
        props.setUserFilters({...userFilters,  [field] : {...userFilters[field], value : newValue}});
    }

    const invertFilter = (field : string) => {
        props.setUserFilters({...userFilters,  [field] : {...userFilters[field], inverted : !userFilters[field].inverted}});
    }

    // if (userFilters !== {}) {
        const userFilterNames = Object.keys(userFilters);

        const userFiltersList = userFilterNames.map(
            (userFilterName) => <>
                <td><button onClick={() => deleteUserFilter(userFilterName)} >x</button></td>
                <td>
                    <FilterFieldNameSelection
                        filterFieldName={userFilterName}
                        allFilterFieldNames={userFilterNames}
                        setUserFilterName={setUserFilterName}
                    />
                </td>
                <td>
                    <displayService.AccountFieldDisplay
                        value={userFilters[userFilterName].value}
                        field={userFilterName}
                        mutable={true}
                        imposeDateFormat={false}
                        onValueChange={setFilterValue}
                    />
                </td>
                <td>
                    <input 
                        type="checkbox" 
                        onChange={() => invertFilter(userFilterName)} 
                        checked={userFilters[userFilterName]?.inverted}
                    />
                </td>
            </>  
        )

        return <>
            <h2> Filtres de comptes </h2>
            {userFiltersList.length > 0 && <Table id="user-filter-table" size="small">
                <thead>
                    <tr>
                        <th>Enlever</th>
                        <th>Champ</th>
                        <th>Valeur</th>
                        <th>Inverser</th>
                    </tr>
                </thead>
                <tbody>
                    {userFiltersList.map((filter, index) => <tr key={"filter " + userFilterNames[index]} >{filter}</tr> )}
                </tbody>
            </Table>}
            <Button 
                className="btn-flat btn-primary"
                onClick={() => props.setUserFilters({...userFilters, [defaultFilterName] : defaultFilter})} 
                disabled={userFilterNames.includes(defaultFilterName)}> 
                    Ajouter un filtre 
            </Button>
        </>
}