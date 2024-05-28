import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('cards3.db')


export type cards = {
    id: number,
    name: string,
    type: string,
    number: string,
    desc?: string,
    pin?: string,
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

export type cardsList = Pick<cards, 'id' | 'balance' | 'name' |'number' | 'type'>

export const createTable = async () => {
    // create table if not exists
    const cardDb = `CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        number TEXT NOT NULL,
        desc TEXT,
        pin TEXT,
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
    await db.runAsync(cardDb)

    await db.runAsync(transactionsDb)
}

export const getCards  = async (setCards: ((value: any[]) => void)) => {
    // create table if not exists
    const query = `SELECT id, name, balance, number, type FROM cards 
    ORDER BY type ASC
    `

    let response = await db.getAllAsync<cards>(query)

    console.log("Obtained cards", response)

    setCards(response)

}

export const getCard  = async (id: number, setCard: ((value:any) => void)) => {
    // create table if not exists
    const query = `SELECT *
    FROM cards where id = ${id}`

    let response: cards = await db.getFirstAsync(query)

    setCard(response)
}

export const editCard  = async (card: cards, setCard) => {
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

    const statement = await db.prepareAsync(query);

    try {
        const result = await statement.executeAsync<cards>(card.balance, card.desc, card.number, card.name, card.pin, card.id);
        console.log('lastInsertRowId:', result.lastInsertRowId);
        console.log('changes:', result.changes);
        for await (const row of result) {
            console.log('name:', row.name);
            setCard(row)
        }


    } catch (err) {
        console.log(err)
    } finally {
        await statement.finalizeAsync();
    }
}

export const updateCard  = async (id: number, balance, expiryDate, lastUsed, setCard) => {
    const query = `UPDATE cards
    SET balance = ${balance},
        expiryDate  = '${expiryDate}',
        lastChecked = '${(new Date()).toLocaleString()}'
        ${lastUsed ? `, lastUsed ='${lastUsed}'`: ''}
    where id = ${id}
    RETURNING *
    `
    const statement = await db.prepareAsync(query);

    try {
        const result = await statement.executeAsync<cards>();
        console.log('lastInsertRowId:', result.lastInsertRowId);
        console.log('changes:', result.changes);
        for await (const row of result) {
            console.log('name:', row.name);
            setCard(row)
        }


    } catch (err) {
        console.log(err)
    } finally {
        await statement.finalizeAsync();
    }
}

export const deleteCard = async (id) => {
    try {
        await db.runAsync('DELETE FROM cards WHERE id = ?', [id])
    } catch (err) {
        console.log(err)
    }
}

export const createCard = async (data: {
    name, type, number, desc, pin, balance
}, setNewCards: (card: cards) => void) => {
    const query = "INSERT INTO cards (name, type, number, desc, pin, balance) VALUES(?,?,?,?,?,?)"

    const statement = await db.prepareAsync(query);
    try {
        let response = await statement.executeAsync<cards>(data.name, data.type,data.number,data.desc,data.pin,data.balance)
        let newName = data.name
        //Auto Generate Name If not set
        if(!data.name) {
            newName = (data.type == 'gc' ? "Gift Card" : "Flybuys") + " " + response.lastInsertRowId

            await db.runAsync(`UPDATE cards SET name = '${newName}' WHERE  id = ${response.lastInsertRowId}`)
        }
        setNewCards({id: response.lastInsertRowId ,...data, name: newName})
    } catch (err) {
        console.log(err)
    }
}

export const createTransactions = async (cardId, transactionArray: transaction[]) => {
    // create table if not exists
    let deleteQuery = `DELETE FROM transactions where cardid = ${cardId};`
    let query = `INSERT INTO transactions (id, cardid, desc, store, amount, date, balance) VALUES`
    let fields = transactionArray.reduce((allData, data, index) => {
        query = query + "(?,?,?,?,?,?,?)" + (index != transactionArray.length -1 ? ',' : ';')

        return allData.concat([data.id, data.cardid ,data.desc, data.store,data.amount,data.date, data.balance])
    }, [])

    try {
        await db.runAsync(deleteQuery)

        await db.runAsync(query, fields)
    } catch (err) {
        console.log(err)
    }
}

export const getTransactions = async (cardId, setTransactions) => {
    // create table if not exists
    let query = `select * from transactions where cardid = ${cardId} order by id desc`

    let response = await db.getAllAsync<cards>(query)

    setTransactions(response)
}