import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

const tableName = 'cards'
const db = SQLite.openDatabase('cards.db')


export type cards = {
    id: number,
    name: string,
    type: string,
    number: string,
    desc?: string,
    pin?: number,
    balance?: number,
    lastUsed?: string,
    lastChecked?: string
}

export const createTable = () => {
    // create table if not exists
    const query = `CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        number TEXT NOT NULL,
        desc TEXT,
        pin INTEGER,
        balance REAL,
        lastUsed TEXT,
        lastChecked TEXT
    );`

    const flybuy = `CREATE TABLE IF NOT EXISTS flybuy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        number TEXT NOT NULL,
        desc TEXT,
        pin INTEGER,
        balance REAL,
        lastUsed TEXT,
        lastChecked TEXT
    );`
  
    db.transaction(tx => {
        tx.executeSql(query, [], 
            (txObj, resultSet) => {
            },
            (txObj, error) => {
                return false
            }
            
        )
    });
}

export const getCards  = (setCards: ((value: any[]) => void)) => {
    // create table if not exists
    const query = `SELECT * FROM cards`

    db.transaction(tx => {
        let resp = tx.executeSql(query, [], 
            (txObj, resultSet) => {
                console.log("Obtained cards", resultSet?.rows?.length)
                if(resultSet.rows) {
                    setCards(resultSet.rows._array)
                }
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
    });
}

export const deleteCard = (id) => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM cards WHERE id = ?', [id], 
            (txObj, resultSet) => {
                console.log(resultSet)
            },
            (txObj, error) => {
                console.log(error)
                return false
            }
            
        )
    });
}

export const createCard = (data: {
    name, type, number, desc, pin, balance
}) => {
    // create table if not exists
    const query = "INSERT INTO cards (name, type, number, desc, pin, balance) VALUES(?,?,?,?,?,?)"

    db.transaction(tx => {
        let resp = tx.executeSql(query, [data.name, data.type,data.number,data.desc,data.pin,data.balance], 
            (txObj, resultSet) => {
                console.log(resultSet)
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
    });
}