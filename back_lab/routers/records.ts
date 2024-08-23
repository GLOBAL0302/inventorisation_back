import express from 'express';
import mysqlDb from '../mysqlDb';
import { IRecord, IRecordsMutations } from '../types';
import { ResultSetHeader } from 'mysql2';
import { imagesUpload } from '../multer';

const recordsRouter = express.Router();

recordsRouter.get('/', async (req, res) => {
  const result = await mysqlDb.getConnection().query('SELECT * FROM records');
  console.log(result);
  const records: IRecord[] = result[0] as IRecord[];

  if (records.length === 0) {
    return res.status(404).send({ error: 'No record found' });
  }
  res.send(records);
});

recordsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await mysqlDb.getConnection().query('SELECT * FROM records WHERE id = ?', [id]);
  const records = result[0] as IRecord[];
  if (records.length == 0) {
    res.status(404).send('No records found.');
  }
  res.send(records[0]);
});

recordsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  if (!req.body.category_id || !req.body.location_id) {
    return res.status(400).send('No location_id or category_id found.');
  }
  const newRecord: IRecordsMutations = {
    category_id: parseInt(req.body.category_id),
    location_id: parseInt(req.body.location_id),
    title: req.body.title,
    description: req.body.description ? req.body.description : '',
    image: req.file ? req.file.filename : null,
  };

  const insertResult = await mysqlDb
    .getConnection()
    .query('INSERT INTO records (category_id, location_id, title, description, image) VALUES (?,?,?,?,?)', [
      newRecord.category_id,
      newRecord.location_id,
      newRecord.title,
      newRecord.description,
      newRecord.image,
    ]);

  const resultHeader = insertResult[0] as ResultSetHeader;
  const getNewResult = await mysqlDb
    .getConnection()
    .query('SELECT * FROM records WHERE id = ?', [resultHeader.insertId]);

  const locations = getNewResult[0] as IRecord[];
  return res.send(locations[0]);
});

recordsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await mysqlDb.getConnection().query('Delete FROM records WHERE id = ?', [id]);

  res.send(`the record by number ${id} been deleted`);
});

recordsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
  const id = req.params.id;

  console.log(req.body.category_id, req.body.location_id);
  if (!req.body.category_id || !req.body.location_id) {
    return res.status(400).send('No location_id or category_id found');
  }
  const newRecord = {
    id: req.params.id,
    category_id: parseInt(req.body.category_id),
    location_id: parseInt(req.body.location_id),
    title: req.body.title,
    description: req.body.description ? req.body.description : '',
    image: req.file ? req.file.filename : null,
  };

  const insertResult = await mysqlDb
    .getConnection()
    .query('UPDATE records SET category_id = ?, location_id = ?, title = ?, description = ?, image = ? WHERE id = ?', [
      newRecord.category_id,
      newRecord.location_id,
      newRecord.title,
      newRecord.description,
      newRecord.image,
      newRecord.id,
    ]);

  res.send(newRecord);
});

export default recordsRouter;
