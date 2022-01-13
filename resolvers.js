import movies from './movies';

const mysql = require('mysql2/promise');
const iconv = require("iconv-lite");


const pool = mysql.createPool({
 	host: '118.67.132.68',
 	user: 'root',
 	password: '1234qwer',
 	database: 'nv'
});

let jwt = require("jsonwebtoken");
let secretObj = require("./jwt");

const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'yskimoda@gmail.com',
    pass: 'ywyvtirtrfmvmlzq'
  }
}));


// getFavorData

const getFavorData= async (did) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';

			sql = `SELECT 
						IFNULL(A.cf_idx, 0) as idx,  
						IFNULL(A.ct_idx, 0) as idx2,  
						IFNULL(A.cf_did, "") as did, 
						IFNULL(B.ct_title, "") as title, 
						IFNULL(B.ct_title_en, "") as title2, 
						IFNULL(B.ct_img1, "") as img1, 
						IFNULL(B.ct_cate1, "") as cate1, 
						IFNULL(B.ct_cate2, "") as cate2, 
						IFNULL(B.ct_cate3, "") as cate3
						FROM cb_favor as A 
						LEFT JOIN cb_trade as B ON A.ct_idx=B.ct_idx  WHERE A.cf_did="${did}"  `;

			sql += ` ORDER BY idx DESC `;
	
			let [rows] = await connection.query(sql);
			connection.release();
			console.log(rows);

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};



const setFavorData= async (did, idx, type) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let user = await getUser(did);

			let sql = '';


			if (type == "del") {
				sql = 'DELETE FROM cb_favor WHERE ct_idx="'+idx+'" AND cf_did="'+did+'"  ';
			} else {
				sql = 'INSERT INTO cb_favor SET ct_idx="'+idx+'", cf_did="'+did+'"  ';
			}
	
			let [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};



const getFilterData= async (type) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';
			
			sql = `SELECT 
						IFNULL(ct_${type}, "") as name
						FROM cb_trade as A 
						WHERE A.ct_${type}<>""  `;
			sql += ` GROUP BY ct_${type} `;

			let [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};


const getSubData= async (cate1, cate2) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';
			
			if (cate2 != "") {

				sql = `SELECT 
							IFNULL(cc_cate3, "") as name,
							cc_desc as description,
							cc_img as img
							FROM cb_category as A 
							WHERE A.cc_cate2="${cate2}" AND A.cc_cate3<>"" AND A.cc_depth=3  `;
				sql += ` ORDER BY cc_order DESC `;

			} else if (cate1 != "")	{
				sql = `SELECT 
							IFNULL(cc_cate2, "") as name,
							cc_desc as description,
							cc_img as img
							FROM cb_category as A 
							WHERE A.cc_cate1="${cate1}" AND A.cc_cate2<>"" AND A.cc_depth=2 `;
				sql += ` ORDER BY cc_order DESC `;
			}

			let [rows] = await connection.query(sql);
			console.log(rows);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};

const getBannerData= async (type) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';

			sql = `SELECT 
						IFNULL(A.cp_idx, 0) as idx,  
						IFNULL(A.cp_type, 0) as type,  
						IFNULL(A.ct_idx, 0) as idx2,  
						IFNULL(B.ct_title, "") as title, 
						IFNULL(B.ct_title_en, "") as title2, 
						IFNULL(B.ct_content, "") as content, 
						IFNULL(B.ct_img1, "") as img1, 
						IFNULL(B.ct_datetime, "") as date, 
						IFNULL(B.ct_status, "") as status, 
						IFNULL(B.ct_cate1, "") as cate1, 
						IFNULL(B.ct_cate2, "") as cate2, 
						IFNULL(B.ct_cate3, "") as cate3, 
						IFNULL(B.ct_qty, 0) as qty, 
						IFNULL(B.ct_oper, "") as oper, 
						IFNULL(B.ct_country, "") as country, 
						IFNULL(B.ct_veh, "") as veh, 
						IFNULL(B.ct_year, "") as year, 
						IFNULL(B.ct_speed, "") as speed, 
						IFNULL(B.ct_voltage, "") as voltage, 
						IFNULL(B.ct_rating, "") as rating, 
						IFNULL(B.ct_output, "") as output, 
						IFNULL(B.ct_cooling, "") as cooling, 
						IFNULL(B.ct_dimension, "") as dimension, 
						IFNULL(B.ct_weight, "") as weight, 
						IFNULL(B.ct_temp, "") as temp
						FROM cb_plus as A 
						LEFT JOIN cb_trade as B ON A.ct_idx=B.ct_idx  WHERE A.cp_type="${type}"  `;

			sql += ` ORDER BY A.cp_listing DESC `;


			let [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};

const inquireDate= async (did) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';

			sql = `SELECT 
						DATE_FORMAT(ci_datetime, "%Y-%m-%d") as date
						FROM cb_inquire 
						WHERE ci_did="${did}" 
						GROUP BY DATE_FORMAT(ci_datetime, "%Y-%m-%d") 
						ORDER BY date DESC `;
	
			let [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};

const getInquireData= async (did, date) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';

			sql = `SELECT 
						IFNULL(A.ci_idx, 0) as idx,  
						IFNULL(A.ci_trade, 0) as idx2,  
						IFNULL(A.ci_did, "") as did, 
						IFNULL(A.ci_name, "") as name, 
						IFNULL(A.ci_company, "") as company, 
						IFNULL(A.ci_tel, "") as tel, 
						IFNULL(A.ci_status, "") as status, 
						IFNULL(A.ci_content, "") as cont, 
						IFNULL(A.ci_reply, "") as reply, 
						IFNULL(B.ct_title, "") as title, 
						IFNULL(B.ct_title_en, "") as title2, 
						IFNULL(B.ct_content, "") as content, 
						IFNULL(B.ct_img1, "") as img1, 
						IFNULL(B.ct_datetime, "") as date, 
						IFNULL(B.ct_cate1, "") as cate1, 
						IFNULL(B.ct_cate2, "") as cate2, 
						IFNULL(B.ct_cate3, "") as cate3, 
						IFNULL(B.ct_qty, 0) as qty, 
						IFNULL(B.ct_oper, "") as oper, 
						IFNULL(B.ct_country, "") as country, 
						IFNULL(B.ct_veh, "") as veh, 
						IFNULL(B.ct_year, "") as year, 
						IFNULL(B.ct_speed, "") as speed, 
						IFNULL(B.ct_voltage, "") as voltage, 
						IFNULL(B.ct_rating, "") as rating, 
						IFNULL(B.ct_output, "") as output, 
						IFNULL(B.ct_cooling, "") as cooling, 
						IFNULL(B.ct_dimension, "") as dimension, 
						IFNULL(B.ct_weight, "") as weight, 
						IFNULL(B.ct_temp, "") as temp
						FROM cb_inquire as A 
						LEFT JOIN cb_trade as B ON A.ci_trade=B.ct_idx  WHERE A.ci_did="${did}"  `;

			if (date != "")
			{
				sql += ` AND A.ci_datetime LIKE "%${date}%" `;
			}
			sql += ` ORDER BY idx DESC `;
	
			let [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};

const getInquireData2= async (idx) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';

			sql = `SELECT 
						IFNULL(A.ci_idx, 0) as idx,  
						IFNULL(A.ci_trade, 0) as idx2,  
						IFNULL(A.ci_did, "") as did, 
						IFNULL(A.ci_name, "") as name, 
						IFNULL(A.ci_company, "") as company, 
						IFNULL(A.ci_tel, "") as tel, 
						IFNULL(A.ci_status, "") as status, 
						IFNULL(A.ci_content, "") as cont, 
						IFNULL(A.ci_reply, "") as reply, 
						IFNULL(B.ct_title, "") as title, 
						IFNULL(B.ct_title_en, "") as title2, 
						IFNULL(B.ct_content, "") as content, 
						IFNULL(B.ct_img1, "") as img1, 
						IFNULL(B.ct_datetime, "") as date, 
						IFNULL(B.ct_status, "") as status, 
						IFNULL(B.ct_cate1, "") as cate1, 
						IFNULL(B.ct_cate2, "") as cate2, 
						IFNULL(B.ct_cate3, "") as cate3, 
						IFNULL(B.ct_qty, 0) as qty, 
						IFNULL(B.ct_oper, "") as oper, 
						IFNULL(B.ct_country, "") as country, 
						IFNULL(B.ct_veh, "") as veh, 
						IFNULL(B.ct_year, "") as year, 
						IFNULL(B.ct_speed, "") as speed, 
						IFNULL(B.ct_voltage, "") as voltage, 
						IFNULL(B.ct_rating, "") as rating, 
						IFNULL(B.ct_output, "") as output, 
						IFNULL(B.ct_cooling, "") as cooling, 
						IFNULL(B.ct_dimension, "") as dimension, 
						IFNULL(B.ct_weight, "") as weight, 
						IFNULL(B.ct_temp, "") as temp
						FROM cb_inquire as A 
						LEFT JOIN cb_trade as B ON A.ci_trade=B.ct_idx  WHERE A.ci_idx="${idx}" `;
	
			let [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};



const setInquireData= async (did, idx, content) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let user = await getUser(did);

			let sql = '';
			
			sql = 'INSERT INTO cb_inquire SET ci_trade="'+idx+'", ci_did="'+did+'", ci_name="'+user[0].name+'", ci_company="'+user[0].company+'", ci_tel="'+user[0].tel+'", ci_content="'+content.replace(/'/g, "\\'")+'"  ';
	
			let [rows] = await connection.query(sql);
			connection.release();

			let pr = await getTrade2(idx, "");

			var html = "";
			html += "제품 정보\n\n";
			html += "제품명 : ["+pr[0].cate1+"] " +pr[0].title+"\n";
			html += "제품코드 : "+ pr[0].idx +"\n\n";

			html += "문의자 정보\n\n";
			html += "담당자 : "+user[0].name+"\n";
			html += "회사명 : "+user[0].company+"\n";
			html += "전화번호 : "+user[0].tel+"\n\n";
			html += "문의내용 : \n"+content+"\n";

			var mailOptions = {
			  from: 'yskimoda@gmail.com',
			  to: 'iysya@naver.com',
			  subject: '우진산전 어플리케이션 - 제품 문의',
			  text: html
			};
					 
			let rtData = await wrapedSendMail(mailOptions);

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};

const getUser= async (did) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';
			
			sql = 'SELECT IFNULL(cu_did, "") as did, IFNULL(cu_name, "") as name, IFNULL(cu_company, "") as company, IFNULL(cu_tel, "") as tel FROM cb_user WHERE cu_did="'+did+'" ';
	
			const [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};



const setUser= async (did, name, company, tel) => {

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = '';
			
			sql = 'SELECT * FROM cb_user WHERE cu_did="'+did+'" ';
	
			let [rows] = await connection.query(sql);

			if (rows.length) {
				sql = 'UPDATE cb_user SET cu_name="'+name+'", cu_company="'+company+'", cu_tel="'+tel+'" WHERE cu_did="'+did+'" ';
			} else {
				sql = 'INSERT INTO cb_user SET cu_did="'+did+'", cu_name="'+name+'", cu_company="'+company+'", cu_tel="'+tel+'" ';
			}
			[rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : 헬프미 입력');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : 헬프미 입력');
		return false;
	}
};



// 메일발송
const wrapedSendMail = async (mailOptions) => {
		return new Promise((resolve,reject)=>{

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log("error is "+error);
					resolve(false);
				} 
				else {
					console.log('Email sent: ' + info.response);
					resolve(true);
				}
			});
		});
};


// trade
const getTrade= async (page=1, stx="", email, cate1, cate2, cate3) => {
	//페이지당 리스트 갯수
	const count = 5;
	const start = count * page;

	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			let sql = `SELECT  
			IFNULL(A.ct_cate1, "") as cate1,
			IFNULL(A.ct_cate2, "") as cate2, 
			IFNULL(A.ct_cate3, "") as cate3, 
			A.ct_qty as qty, 
			IFNULL(A.ct_oper, "") as oper, 
			IFNULL(A.ct_country, "") as country, 
			IFNULL(A.ct_veh, "") as veh, 
			IFNULL(A.ct_year, "") as year, 
			IFNULL(A.ct_speed, "") as speed, 
			IFNULL(A.ct_voltage, "") as voltage, 
			IFNULL(A.ct_rating, "") as rating, 
			IFNULL(A.ct_output, "") as output, 
			IFNULL(A.ct_cooling, "") as cooling, 
			IFNULL(A.ct_dimension, "") as dimension, 
			IFNULL(A.ct_weight, "") as weight, 
			IFNULL(A.ct_temp, "") as temp,
			IFNULL(A.ct_op1, "") as op1,
			IFNULL(A.ct_op2, "") as op2,
			IFNULL(A.ct_op3, "") as op3,
			IFNULL(A.ct_op4, "") as op4,
			IFNULL(A.ct_op5, "") as op5,
			IFNULL(A.ct_op6, "") as op6,
			IFNULL(A.ct_op7, "") as op7,
			IFNULL(A.ct_op8, "") as op8,
			IFNULL(A.ct_op9, "") as op9,
			IFNULL(A.ct_op10, "") as op10,
			IFNULL(A.ct_op11, "") as op11,
			IFNULL(A.ct_op12, "") as op12,
			IFNULL(A.ct_op13, "") as op13,
			IFNULL(A.ct_op14, "") as op14,
			IFNULL(A.ct_op15, "") as op15,
			IFNULL(A.ct_op16, "") as op16,
			IFNULL(A.ct_op17, "") as op17,
			IFNULL(A.ct_op18, "") as op18,
			IFNULL(A.ct_op19, "") as op19,
			IFNULL(A.ct_op20, "") as op20,
			IFNULL(A.ct_op_en1, "") as eop1,
			IFNULL(A.ct_op_en2, "") as eop2,
			IFNULL(A.ct_op_en3, "") as eop3,
			IFNULL(A.ct_op_en4, "") as eop4,
			IFNULL(A.ct_op_en5, "") as eop5,
			IFNULL(A.ct_op_en6, "") as eop6,
			IFNULL(A.ct_op_en7, "") as eop7,
			IFNULL(A.ct_op_en8, "") as eop8,
			IFNULL(A.ct_op_en9, "") as eop9,
			IFNULL(A.ct_op_en10, "") as eop10,
			IFNULL(A.ct_op_en11, "") as eop11,
			IFNULL(A.ct_op_en12, "") as eop12,
			IFNULL(A.ct_op_en13, "") as eop13,
			IFNULL(A.ct_op_en14, "") as eop14,
			IFNULL(A.ct_op_en15, "") as eop15,
			IFNULL(A.ct_op_en16, "") as eop16,
			IFNULL(A.ct_op_en17, "") as eop17,
			IFNULL(A.ct_op_en18, "") as eop18,
			IFNULL(A.ct_op_en19, "") as eop19,
			IFNULL(A.ct_op_en20, "") as eop20,
			IFNULL(A.ct_op_title1, "") as opt1,
			IFNULL(A.ct_op_title2, "") as opt2,
			IFNULL(A.ct_op_title3, "") as opt3,
			IFNULL(A.ct_op_title4, "") as opt4,
			IFNULL(A.ct_op_title5, "") as opt5,
			IFNULL(A.ct_op_title6, "") as opt6,
			IFNULL(A.ct_op_title7, "") as opt7,
			IFNULL(A.ct_op_title8, "") as opt8,
			IFNULL(A.ct_op_title9, "") as opt9,
			IFNULL(A.ct_op_title10, "") as opt10,
			IFNULL(A.ct_op_title11, "") as opt11,
			IFNULL(A.ct_op_title12, "") as opt12,
			IFNULL(A.ct_op_title13, "") as opt13,
			IFNULL(A.ct_op_title14, "") as opt14,
			IFNULL(A.ct_op_title15, "") as opt15,
			IFNULL(A.ct_op_title16, "") as opt16,
			IFNULL(A.ct_op_title17, "") as opt17,
			IFNULL(A.ct_op_title18, "") as opt18,
			IFNULL(A.ct_op_title19, "") as opt19,
			IFNULL(A.ct_op_title20, "") as opt20,
			IFNULL(A.ct_op_title_en1, "") as opte1,
			IFNULL(A.ct_op_title_en2, "") as opte2,
			IFNULL(A.ct_op_title_en3, "") as opte3,
			IFNULL(A.ct_op_title_en4, "") as opte4,
			IFNULL(A.ct_op_title_en5, "") as opte5,
			IFNULL(A.ct_op_title_en6, "") as opte6,
			IFNULL(A.ct_op_title_en7, "") as opte7,
			IFNULL(A.ct_op_title_en8, "") as opte8,
			IFNULL(A.ct_op_title_en9, "") as opte9,
			IFNULL(A.ct_op_title_en10, "") as opte10,
			IFNULL(A.ct_op_title_en11, "") as opte11,
			IFNULL(A.ct_op_title_en12, "") as opte12,
			IFNULL(A.ct_op_title_en13, "") as opte13,
			IFNULL(A.ct_op_title_en14, "") as opte14,
			IFNULL(A.ct_op_title_en15, "") as opte15,
			IFNULL(A.ct_op_title_en16, "") as opte16,
			IFNULL(A.ct_op_title_en17, "") as opte17,
			IFNULL(A.ct_op_title_en18, "") as opte18,
			IFNULL(A.ct_op_title_en19, "") as opte19,
			IFNULL(A.ct_op_title_en20, "") as opte20,
			A.ct_desc as description,
			A.ct_desc_en as descriptione,
			A.ct_idx as idx, 
			A.mem_userid as user,
			A.ct_title as title,
			IFNULL(A.ct_title_en,"") as title2,  
			A.ct_content as content, 
			IFNULL(A.ct_addr1, "") as addr1, 
			IFNULL(A.ct_addr2, "") as addr2, 
			IFNULL(A.ct_like, 0)  as wlike, 
			IFNULL(A.ct_cmt, 0) as cmt, 
			IFNULL(A.ct_view, 0) as view, 
			IFNULL(A.ct_price, 0) as price, 
			IFNULL(A.ct_status, "") as wstatus, 
			IFNULL(ct_img1, "") as img1, 
			IFNULL(ct_img2, "") as img2, 
			IFNULL(ct_img3, "") as img3, 
			IFNULL(ct_img4, "") as img4, 
			IFNULL(ct_img5, "") as img5,  
			A.ct_datetime as date, 
			IFNULL(B.mem_nickname, "") as nick, 
			IFNULL(B.mem_family, "") as family, 
			IFNULL(B.mem_photo, "") as img, 
			IFNULL(B.mem_status, "") as status, 
			IFNULL(B.mem_address1, "") as address, 
			IFNULL(mem_register_datetime, "") as rdate, 
			IFNULL(C.cf_idx, 0) as ulike   
			FROM cb_trade as A 
			LEFT JOIN cb_member as B ON A.mem_userid=B.mem_userid 
			LEFT JOIN cb_favor as C ON (A.ct_idx = C.ct_idx  AND C.cf_did="${email}")  `;

			let sqlAdd = "";
			if (cate1.trim() != "") {
				sqlAdd += ' WHERE A.ct_cate1 LIKE "%'+cate1+'%" ';
			}

			if (cate2.trim() != "") {
				sqlAdd += ' AND A.ct_cate2 LIKE "%'+cate2+'%" ';
			}

			if (cate3.trim() != "") {
				sqlAdd += ' AND A.ct_cate3 LIKE "%'+cate3+'%" ';
			}

			if (stx != ""){
				if (sqlAdd != ""){
					sqlAdd += ' AND  (A.ct_title_en LIKE "%'+stx+'%" OR A.ct_title LIKE "%'+stx+'%" OR A.ct_cate1 LIKE "%'+stx+'%" OR A.ct_cate2 LIKE "%'+stx+'%" OR A.ct_cate3 LIKE "%'+stx+'%") ';
				} else {
					sqlAdd += ' WHERE  (A.ct_title_en LIKE "%'+stx+'%" OR A.ct_title LIKE "%'+stx+'%" OR A.ct_cate1 LIKE "%'+stx+'%" OR A.ct_cate2 LIKE "%'+stx+'%" OR A.ct_cate3 LIKE "%'+stx+'%") ';
				}
			}
			sql += sqlAdd + ' ORDER BY A.ct_order DESC LIMIT '+ start +', '+ count +'  ';

			console.log(sql);
	
			const [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : wick');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : wick');
		return false;
	}
};

// trade
const getTrade2= async (idx, email) => {


	try {
		const connection = await pool.getConnection(async conn => conn);
		try {

			const sql = `SELECT  
			IFNULL(A.ct_cate1, "") as cate1,
			IFNULL(A.ct_cate2, "") as cate2, 
			IFNULL(A.ct_cate3, "") as cate3, 
			A.ct_qty as qty, 
			IFNULL(A.ct_oper, "") as oper, 
			IFNULL(A.ct_country, "") as country, 
			IFNULL(A.ct_veh, "") as veh, 
			IFNULL(A.ct_year, "") as year, 
			IFNULL(A.ct_speed, "") as speed, 
			IFNULL(A.ct_voltage, "") as voltage, 
			IFNULL(A.ct_rating, "") as rating, 
			IFNULL(A.ct_output, "") as output, 
			IFNULL(A.ct_cooling, "") as cooling, 
			IFNULL(A.ct_dimension, "") as dimension, 
			IFNULL(A.ct_weight, "") as weight, 
			IFNULL(A.ct_temp, "") as temp,
			IFNULL(A.ct_op1, "") as op1,
			IFNULL(A.ct_op2, "") as op2,
			IFNULL(A.ct_op3, "") as op3,
			IFNULL(A.ct_op4, "") as op4,
			IFNULL(A.ct_op5, "") as op5,
			IFNULL(A.ct_op6, "") as op6,
			IFNULL(A.ct_op7, "") as op7,
			IFNULL(A.ct_op8, "") as op8,
			IFNULL(A.ct_op9, "") as op9,
			IFNULL(A.ct_op10, "") as op10,
			IFNULL(A.ct_op11, "") as op11,
			IFNULL(A.ct_op12, "") as op12,
			IFNULL(A.ct_op13, "") as op13,
			IFNULL(A.ct_op14, "") as op14,
			IFNULL(A.ct_op15, "") as op15,
			IFNULL(A.ct_op16, "") as op16,
			IFNULL(A.ct_op17, "") as op17,
			IFNULL(A.ct_op18, "") as op18,
			IFNULL(A.ct_op19, "") as op19,
			IFNULL(A.ct_op20, "") as op20,
			IFNULL(A.ct_op_en1, "") as eop1,
			IFNULL(A.ct_op_en2, "") as eop2,
			IFNULL(A.ct_op_en3, "") as eop3,
			IFNULL(A.ct_op_en4, "") as eop4,
			IFNULL(A.ct_op_en5, "") as eop5,
			IFNULL(A.ct_op_en6, "") as eop6,
			IFNULL(A.ct_op_en7, "") as eop7,
			IFNULL(A.ct_op_en8, "") as eop8,
			IFNULL(A.ct_op_en9, "") as eop9,
			IFNULL(A.ct_op_en10, "") as eop10,
			IFNULL(A.ct_op_en11, "") as eop11,
			IFNULL(A.ct_op_en12, "") as eop12,
			IFNULL(A.ct_op_en13, "") as eop13,
			IFNULL(A.ct_op_en14, "") as eop14,
			IFNULL(A.ct_op_en15, "") as eop15,
			IFNULL(A.ct_op_en16, "") as eop16,
			IFNULL(A.ct_op_en17, "") as eop17,
			IFNULL(A.ct_op_en18, "") as eop18,
			IFNULL(A.ct_op_en19, "") as eop19,
			IFNULL(A.ct_op_en20, "") as eop20,
			IFNULL(A.ct_op_title1, "") as opt1,
			IFNULL(A.ct_op_title2, "") as opt2,
			IFNULL(A.ct_op_title3, "") as opt3,
			IFNULL(A.ct_op_title4, "") as opt4,
			IFNULL(A.ct_op_title5, "") as opt5,
			IFNULL(A.ct_op_title6, "") as opt6,
			IFNULL(A.ct_op_title7, "") as opt7,
			IFNULL(A.ct_op_title8, "") as opt8,
			IFNULL(A.ct_op_title9, "") as opt9,
			IFNULL(A.ct_op_title10, "") as opt10,
			IFNULL(A.ct_op_title11, "") as opt11,
			IFNULL(A.ct_op_title12, "") as opt12,
			IFNULL(A.ct_op_title13, "") as opt13,
			IFNULL(A.ct_op_title14, "") as opt14,
			IFNULL(A.ct_op_title15, "") as opt15,
			IFNULL(A.ct_op_title16, "") as opt16,
			IFNULL(A.ct_op_title17, "") as opt17,
			IFNULL(A.ct_op_title18, "") as opt18,
			IFNULL(A.ct_op_title19, "") as opt19,
			IFNULL(A.ct_op_title20, "") as opt20,
			IFNULL(A.ct_op_title_en1, "") as opte1,
			IFNULL(A.ct_op_title_en2, "") as opte2,
			IFNULL(A.ct_op_title_en3, "") as opte3,
			IFNULL(A.ct_op_title_en4, "") as opte4,
			IFNULL(A.ct_op_title_en5, "") as opte5,
			IFNULL(A.ct_op_title_en6, "") as opte6,
			IFNULL(A.ct_op_title_en7, "") as opte7,
			IFNULL(A.ct_op_title_en8, "") as opte8,
			IFNULL(A.ct_op_title_en9, "") as opte9,
			IFNULL(A.ct_op_title_en10, "") as opte10,
			IFNULL(A.ct_op_title_en11, "") as opte11,
			IFNULL(A.ct_op_title_en12, "") as opte12,
			IFNULL(A.ct_op_title_en13, "") as opte13,
			IFNULL(A.ct_op_title_en14, "") as opte14,
			IFNULL(A.ct_op_title_en15, "") as opte15,
			IFNULL(A.ct_op_title_en16, "") as opte16,
			IFNULL(A.ct_op_title_en17, "") as opte17,
			IFNULL(A.ct_op_title_en18, "") as opte18,
			IFNULL(A.ct_op_title_en19, "") as opte19,
			IFNULL(A.ct_op_title_en20, "") as opte20,
			A.ct_desc as description,
			A.ct_desc_en as descriptione,
			A.ct_idx as idx, 
			A.mem_userid as user,
			A.ct_title as title,
			IFNULL(A.ct_title_en, "") as title2,  
			A.ct_content as content, 
			IFNULL(A.ct_addr1, "") as addr1, 
			IFNULL(A.ct_addr2, "") as addr2, 
			IFNULL(A.ct_like, 0)  as wlike, 
			IFNULL(A.ct_cmt, 0) as cmt, 
			IFNULL(A.ct_view, 0) as view, 
			IFNULL(A.ct_price, 0) as price, 
			IFNULL(A.ct_status, "") as wstatus, 
			IFNULL(ct_img1, "") as img1, 
			IFNULL(ct_img2, "") as img2, 
			IFNULL(ct_img3, "") as img3, 
			IFNULL(ct_img4, "") as img4, 
			IFNULL(ct_img5, "") as img5,  
			A.ct_datetime as date, 
			IFNULL(B.mem_nickname, "") as nick, 
			IFNULL(B.mem_family, "") as family, 
			IFNULL(B.mem_photo, "") as img, 
			IFNULL(B.mem_status, "") as status, 
			IFNULL(B.mem_address1, "") as address, 
			IFNULL(mem_register_datetime, "") as rdate, 
			IFNULL(C.cf_idx, 0) as ulike   
			FROM cb_trade as A 
			LEFT JOIN cb_member as B ON A.mem_userid=B.mem_userid 
			LEFT JOIN cb_favor as C ON (A.ct_idx = C.ct_idx  AND C.cf_did="${email}")  
			WHERE A.ct_idx="${idx}"  `;

			//console.log(sql);
	
			const [rows] = await connection.query(sql);
			connection.release();

			return rows;
		} catch(err) {
			console.log(err, 'Query Error : wick');
			connection.release();
			return false;
		}
	} catch(err) {
		console.log('DB Error : wick');
		return false;
	}
};


const resolvers = {
  Query: {
    movies: () => movies,
    movie: (_, { id }) => {
      return movies.filter(movie => movie.id === id)[0];
    }
  },
  Mutation: {
	
		trade: async (_, { page, stx, email, cate1, cate2, cate3 }) => {
	
		let mData = await getTrade(page, stx, email, cate1, cate2, cate3);
		
		// console.log(mData);
			
		if(mData.length) {

			return mData;
			
		} else {
			throw new Error("9998");
		}
		
	},

	seltrade: async (_, { idx, email }) => {
	
		let mData = await getTrade2(idx, email);
		
		// console.log(mData);
			
		if(mData.length) {

			return mData[0];
			
		} else {
			throw new Error("9998");
		}
			
		
	},
	setUserInfo: async (_, { did, name, company, tel }) => {
	
		await setUser(did, name, company, tel);
		let mData = await getUser(did);
		
		if(mData.length) {
			return mData[0];
		} else {
			throw new Error("9997");
		}
	},
	getUserInfo: async (_, { did }) => {
	
		let mData = await getUser(did);
		
		if(mData.length) {
			return mData[0];
		} else {
			throw new Error("9997");
		}
	},
	setInquire: async (_, { did, idx, content }) => {
	
		let mData = await setInquireData(did, idx, content);
		
		const rt = {
			rst: 'ok'
		};
		return rt;
	},
	getInquire: async (_, { did, date }) => {
	
		let mData = await getInquireData(did, date);

		//console.log(mData);
		
		if(mData.length) {
			return mData;
		} else {
			throw new Error("9997");
		}
	},
	getInquire2: async (_, { idx }) => {
	
		let mData = await getInquireData2(idx);
		
		if(mData.length) {
			return mData[0];
		} else {
			throw new Error("9997");
		}
	},
	getInquireDate: async (_, { did }) => {
	
		let mData = await inquireDate(did);
		//console.log(mData);
		
		if(mData.length) {
			return mData;
		} else {
			throw new Error("9997");
		}
	},
	getBanner: async (_, { type }) => {
	
		let mData = await getBannerData(type);
		//console.log(mData);
		
		if(mData.length) {
			return mData;
		} else {
			throw new Error("9997");
		}
	},
	getSub: async (_, { cate1, cate2 }) => {
	
		let mData = await getSubData(cate1, cate2);
		// console.log(mData);
		
		if(mData.length) {
			return mData;
		} else {
			throw new Error("9997");
		}
	},
	getFilter: async (_, { type }) => {
	
		let mData = await getFilterData(type);
		//console.log(mData);
		
		if(mData.length) {
			return mData;
		} else {
			throw new Error("9997");
		}
	},
	setFavor: async (_, { did, idx, type }) => {
	
		let mData = await setFavorData(did, idx, type);
		//console.log(mData);
		
		let mData2 = await getFavorData(did);
		//console.log(mData);
		
		if(mData2.length) {
			return mData2;
		} else {
			throw new Error("9997");
		}
	},
	getFavor: async (_, { did }) => {
	
		let mData = await getFavorData(did);
		//console.log(mData);
		
		if(mData.length) {
			return mData;
		} else {
			throw new Error("9997");
		}
	},
		
		


  }
};

export default resolvers;
