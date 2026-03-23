/*
Materiales(Clave, Descripción, Costo, Impuesto)
Proveedores(RFC, RazonSocial)
Proyectos(Numero, Denominacion)
Entregan(Clave, RFC, Numero, Fecha, Cantidad)
*/

select sum(e.cantidad) as 'suma de cantidades', sum(cantidad * (m.costo + m.impuesto)) as 'importe total'
from entregan e, materiales m
where e.clave = m.clave
and e.fecha between '01/01/1997' and '31/12/1997';

select p.razonsocial, count(e.rfc) as 'numero de entregas', sum(e.cantidad * (m.costo + m.impuesto)) as 'importe total'
from proveedores p, materiales m, entregan e
where p.rfc = e.rfc and e.clave = m.clave
group by p.rfc, p.razonsocial;

select m.clave, m.descripcion, sum(e.cantidad) as 'cantidad total entregada', min(e.cantidad) as 'minima cantidad entregada', max(e.cantidad) as 'maxima cantidad entregada', sum(e.cantidad)*(m.costo+m.impuesto) as 'importe total'
from materiales m, entregan e
where m.clave = e.clave
group by m.clave, m.descripcion
having avg(e.cantidad) > 400;

select p.razonsocial, m.clave, m.descripcion, avg(e.cantidad) as 'cantidad promedio'
from proveedores p, entregan e, materiales m
where p.rfc = e.rfc and e.clave = m.clave
group by p.razonsocial, m.clave, m.dedscripcion
having avg(e.cantidad) > 500;

select p.razonsocial, m.clave, m.descripcion, avg(e.cantidad) as 'cantidad promedio'
from proveedores p, entregan e, materiales m
where p.rfc = e.rfc and e.clave = m.clave
group by p.razonsocial, m.clave, m.dedscripcion
having avg(e.cantidad) < 370
union
select p.razonsocial, m.clave, m.descripcion, avg(e.cantidad) as 'cantidad promedio'
from proveedores p, entregan e, materiales m
where p.rfc = e.rfc and e.clave = m.clave
group by p.razonsocial, m.clave, m.dedscripcion
having avg(e.cantidad) > 450;

INSERT INTO Materiales
VALUES (1, 'CEMENTO', 120.50, 16.00);
INSERT INTO Materiales
VALUES (2, 'VARILLA', 75.00, 16.00);
INSERT INTO Materiales
VALUES (3, 'ARENA', 200.00, 16.00);
INSERT INTO Materiales
VALUES (4, 'GRAVA', 210.00, 16.00);
INSERT INTO Materiales
VALUES (5, 'BLOCK HUECO', 12.00, 16.00);

/*
Materiales(Clave, Descripción, Costo, Impuesto)
Proveedores(RFC, RazonSocial)
Proyectos(Numero, Denominacion)
Entregan(Clave, RFC, Numero, Fecha, Cantidad)
*/

select m.clave, m.descripcion
from materiales m
where not exists (select * from entregan e where e.clave = m.clave);

select p.razonsocial
from proveedores p
where p.rfc in(select e.rfc from entregan e, proyectos p where e.numero = p.numero and p.denominacioin = 'Querétaro Limpio')
and p.rfc in(select e.rfc from entregan e, proyectos p where e.numero = p.numero and p.denominacioin = 'Vamos México');

select m.descripcion
from materiales m
where not exists(select * from entregan e, proyectos p where e.clave = m.clave and e.numero = p.numero and p.denominacion = 'CIT Yucatán');

select p.razonsocial, avg(e.cantidad) as 'promedio cantidad'
from proveedores p, entregan e
where p.rfc = e.rfc
having avg(e.cantidad) > (select avg(e2.cantidad) from entregan e2 where e2.rfc = 'VAGO780901');

select p.rfc, p.razonsocial
from proveedores p
where p.rfc in(select e.rfc from entregan e, proyectos pr where e.numero = pr.numero and pr.denominacion = 'Infonavit Durango')
and (select sum(e2.cantidad)
	from entregan e2, proyectos pr2
    where e2.rfc = p.rfc
    and e2.numero = pr2.numero
    and pr2.denominacion = 'Infonavit Durango'
    and e2.fecha between '01/01/2000' and '31/12/2000')
>(select sum(e3.cantidad)
	from entregan e3, proyectos pr3
    where e3.rfc = p.rfc
    and e3.numero = pr3.numero
    and pr3.denominacion = 'Infonavit Durango'
    and e3.fecha between '01/01/2001' and '31/12/2001');
    