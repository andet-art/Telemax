import express from 'express';
import pool from '../config/db.js';
import { v, schemas } from '../utils/validate.js';
const router = express.Router();

// price calculation
router.post('/price', async (req,res)=>{
  try {
    const body = v(schemas.builderPrice, req.body);
    const ids = [body.starter_id, body.ring_id, body.top_id];
    const [rows] = await pool.query(`SELECT id, price FROM parts WHERE id IN (?,?,?)`, ids);
    const priceMap = new Map(rows.map(r=>[r.id, Number(r.price||0)]));
    const unit = (priceMap.get(body.starter_id)||0) + (priceMap.get(body.ring_id)||0) + (priceMap.get(body.top_id)||0);
    const total = unit * body.quantity;
    res.json({ unit_price:Number(unit.toFixed(2)), quantity:body.quantity, total_price:Number(total.toFixed(2)) });
  } catch(e){ res.status(e.status||400).json({ error:e.message }); }
});

// list parts grouped
router.get('/parts', async (_req,res)=>{
  try{
    const [rows] = await pool.query(`SELECT id,type,name,price,image_url FROM parts ORDER BY type,id`);
    const grouped = { starter:[], ring:[], top:[] };
    rows.forEach(p=> grouped[p.type].push(p));
    res.json(grouped);
  }catch(e){ res.status(500).json({error:e.message}); }
});

export default router;
