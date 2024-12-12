export class Vector2 {

	constructor(x, y, type) {
		this.init(x, y, type);
	}

	// переинициализировать вектор
	init(x, y, type) {
		if (type === 'rad') {
			this.angle = x;
			this.length = y;
			this.x = this.length * Math.cos(this.angle);
			this.y = this.length * Math.sin(this.angle);
		} else if (type === 'grad') {
			this.angle = x * Math.PI / 180;
			this.length = y;
			this.x = this.length * Math.cos(this.angle);
			this.y = this.length * Math.sin(this.angle);
		} else {
			this.x = x ?? 0;
			this.y = y ?? 0;
			const angle = this.toAngle();
			this.angle = isNaN(angle) ? (this.angle || 0) : angle;
			this.length = this.length();
		}
		return this;
	};

	rotate(deltaAngle) {
		this.angle += deltaAngle * Math.PI / 180;
		this.x = this.length * Math.cos(this.angle);
		this.y = this.length * Math.sin(this.angle);
	}

	rotateRad(deltaAngle) {
		this.angle += deltaAngle;
		this.x = this.length * Math.cos(this.angle);
		this.y = this.length * Math.sin(this.angle);
	}	

	// инвертировать вектор
	negative() {
		return new Vector2(-this.x, -this.y);
	};

	// сложить с вектором или скаляром
	add(v) {
		if (v instanceof Vector2) return new Vector2(this.x + v.x, this.y + v.y);
		else return new Vector2(this.x + v, this.y + v);
	};

	// вычесть вектор или скаляр
	subtract(v) {
		if (v instanceof Vector2) return new Vector2(this.x - v.x, this.y - v.y);
		else return new Vector2(this.x - v, this.y - v);
	};

	// умножить на вектор или скаляр
	multiply(v) {
		if (v instanceof Vector2) return new Vector2(this.x * v.x, this.y * v.y);
		else return new Vector2(this.x * v, this.y * v);
	};

	// разделить на вектор или скаляр
	divide(v) {
		if (v instanceof Vector2) return new Vector2(this.x / v.x, this.y / v.y);
		else return new Vector2(this.x / v, this.y / v);
	};

	// сравнить с вектором
	equals(v) {
		return this.x == v.x && this.y == v.y;
	};

	// скалярное перемножение векторов	
	dot(v) {
		return this.x * v.x + this.y * v.y;
	};

	// ???
	cross(v) {
		return new Vector2(
			this.y * v.x - this.x * v.y,
			this.x * v.y - this.y * v.x
		);
	};

	// длинна вектора
	length() {
		return Math.hypot(this.x, this.y);
	};

	// нормализация вектора
	unit() {
		return this.divide(this.length());
	};

	normalize() {
		return this.divide(this.length())
	};

	min() {
		return Math.min(this.x, this.y);
	};

	max() {
		return Math.max(this.x, this.y);
	};

	// получение угла между вектором и осью X
	toAngle() {
		return Math.atan2(this.y, this.x);
	};

	// получение угла между двумя вектороми
	angleTo(v) {
		return Math.acos(this.dot(v) / (this.length() * v.length()));
	};

	// создать массив из вектора
	toArray(n) {
		return [this.x, this.y].slice(0, n || 3);
	};

	// слонировать вектор
	clone() {
		return new Vector2(this.x, this.y);
	};

	// получить нормаль к вектору
	normal() {
		return new Vector2(-this.y, this.x);
	};

	// получить объект Point
	toLocate() {
		return {
			x: this.x,
			y: this.y
		}
	}
};




