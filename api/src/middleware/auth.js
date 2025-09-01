import jwt from 'jsonwebtoken';
export const requireAuth = (req,res,next)=>{
  const h=req.headers.authorization||''; const t=h.startsWith('Bearer ')&&h.slice(7);
  if(!t) return res.status(401).json({error:'Unauthorized'});
  try{ req.user=jwt.verify(t, process.env.JWT_SECRET); next(); }
  catch{ return res.status(401).json({error:'Unauthorized'}); }
};
export const requireAdmin=(req,res,next)=> req.user?.role==='admin'?next():res.status(403).json({error:'Forbidden'});
