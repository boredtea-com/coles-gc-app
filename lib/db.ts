import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('cards3.db')


export type cards = {
    id: number,
    name: string,
    type: string,
    number: string,
    desc?: string,
    pin?: number,
    balance?: number,
    lastUsed?: string,
    lastChecked?: string,
    expiryDate?: string
}

export type transaction = {
    id: string,
    cardid: number,
    desc?: string,
    store: string,
    amount: string,
    date: string,
    balance: string,
}

export type cardsList = Pick<cards, 'id' | 'balance' | 'name' |'number'>

export const createTable = () => {
    // create table if not exists
    const cardDb = `CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        number TEXT NOT NULL,
        desc TEXT,
        pin INTEGER,
        balance REAL,
        lastUsed TEXT,
        lastChecked TEXT,
        expiryDate TEXT
    );
    `
    const transactionsDb = `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        cardid INTEGER,
        desc TEXT,
        store TEXT,
        amount TEXT,
        date TEXT,
        balance TEXT
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
        tx.executeSql(cardDb, [], 
            (txObj, resultSet) => {
            },
            (txObj, error) => {
                return false
            }  
        )
        tx.executeSql(transactionsDb, [], 
            (txObj, resultSet) => {
                console.log(resultSet)
            },
            (txObj, error) => {
                return false
            }  
        )
    });
}

export const getCards  = (setCards: ((value: any[]) => void)) => {
    // create table if not exists
    const query = `SELECT id, name, balance, number FROM cards`

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

export const getCard  = (id: number, setCard: ((value:any) => void)) => {
    // create table if not exists
    const query = `SELECT *
    FROM cards where id = ${id}`

    db.transaction(tx => {
        let resp = tx.executeSql(query, [], 
            (txObj, resultSet) => {
                console.log("Obtained cards", resultSet.rows.item(0))
                if(resultSet.rows) {
                    setCard(resultSet.rows.item(0))
                }
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
    });
}

export const editCard  = (card: cards, setCard) => {
    // create table if not exists
    const query = `UPDATE cards
    SET balance = ?,
        desc = ?,
        number = ?,
        name = ?,
        pin = ?
    where id = ?
    RETURNING *
    `

    db.transaction(tx => {
        let resp = tx.executeSql(query, [card.balance, card.desc, card.number, card.name, card.pin, card.id], 
            (txObj, resultSet) => {
                console.log(resultSet)
                if(resultSet.rows) {
                    setCard(resultSet.rows.item(0))
                }
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
    });
}

export const updateCard  = (id: number, balance, expiryDate, lastUsed, setCard) => {
    // create table if not exists
    const query = `UPDATE cards
    SET balance = ${balance},
        expiryDate  = '${expiryDate}',
        lastChecked = '${(new Date()).toLocaleString()}'
        ${lastUsed ? `, lastUsed ='${lastUsed}'`: ''}
    where id = ${id}
    RETURNING *
    `
    console.log(query)

    db.transaction(tx => {
        let resp = tx.executeSql(query, [], 
            (txObj, resultSet) => {
                console.log(resultSet)
                if(resultSet.rows) {
                    console.log(resultSet.rows.item(0))
                    setCard(resultSet.rows.item(0))
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
}, setNewCards: (card: cards) => void) => {
    // create table if not exists
    const query = "INSERT INTO cards (name, type, number, desc, pin, balance) VALUES(?,?,?,?,?,?)"

    db.transactionAsync( async tx => {
        let result = await tx.executeSqlAsync(query, [data.name, data.type,data.number,data.desc,data.pin,data.balance])
        let newName = data.name
        //Auto Generate Name If not set
        if(!data.name) {
            newName = (data.type == 'gc' ? "Gift Card" : "Flybuys") + " " +result.insertId

            await tx.executeSqlAsync(`UPDATE cards SET name = '${newName}' WHERE  id = ${result.insertId}`, [])
        }


        setNewCards({id: result.insertId ,...data, name: newName})
    });
}

export const createTransactions = (cardId, transactionArray: transaction[]) => {
    // create table if not exists
    let deleteQuery = `DELETE FROM transactions where cardid = ${cardId};`
    let query = `INSERT INTO transactions (id, cardid, desc, store, amount, date, balance) VALUES`
    let fields = transactionArray.reduce((allData, data, index) => {
        query = query + "(?,?,?,?,?,?,?)" + (index != transactionArray.length -1 ? ',' : ';')

        return allData.concat([data.id, data.cardid ,data.desc, data.store,data.amount,data.date, data.balance])
    }, [])


    db.transaction(tx => {        
        tx.executeSql(deleteQuery, [], 
            (txObj, resultSet) => {
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
        tx.executeSql(query, fields, 
            (txObj, resultSet) => {
                console.log(resultSet)
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
    });
}

export const getTransactions = (cardId, setTransactions) => {
    // create table if not exists
    let query = `select * from transactions where cardid = ${cardId} order by id desc`


    db.transaction(tx => {        
        tx.executeSql(query, [], 
            (txObj, resultSet) => {
                if(resultSet.rows.length) {
                    setTransactions(resultSet.rows._array)
                }
            },
            //@ts-ignore
            (txObj, error) => console.log(error)
            
        )
    });
}