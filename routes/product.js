var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname );
  }
});

var upload = multer({ storage: storage });

function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    return str;
}

var Cate1 = require('../model/Cate.js');
var Cate = require('../model/Cate.js');
var Cate2 = require('../model/Cate.js');
var Product = require('../model/Product.js');

/* GET home page. */
router.get('/', checkAdmin, function (req, res) {
	res.redirect('/admin/product/danh-sach.html')
});

router.get('/danh-sach.html',  checkAdmin,function (req, res) {

	Product.find().then(function(pro){
		res.render('admin/product/danhsach', {product: pro});
	});
});

router.get('/them-product.html', checkAdmin, function (req, res) {
	Cate.find().then(function(cate){
		res.render('admin/product/them',{errors: null, cate: cate});
	});
});
var cpUpload = upload.fields([{ name: 'img', maxCount: 1 }, { name: 'img1', maxCount: 8 }])
router.post('/them-product.html',cpUpload,function (req, res) {
	req.checkBody('name', 'Tên không được rổng').notEmpty();
	//req.checkBody('hinh', 'Hình không được rổng').notEmpty();
	req.checkBody('gia', 'giá phải là số').isInt();
	req.checkBody('des', 'Chi tiết không được rổng').notEmpty();
	console.log(req.file);
    var errors = req.validationErrors();
	if (errors) {
		var file = './public/upload/' + req.file.filename;
		  var fs = require('fs');
			fs.unlink(file, function(e){
				if(e) throw e;
			});
  		Cate.find().then(function(cate){
			res.render('admin/product/them',{errors: errors, cate: cate});
		});
	}else{
		var pro = new Product({
			name 			: req.body.name,
			nameKhongDau 	: bodauTiengViet(req.body.name),
      img 			: req.files['img'][0].filename,
			img1 			: req.files['img1'][0].filename,
      img2 			: req.files['img1'][1].filename,
      img3 			: req.files['img1'][2].filename,
			cateId 			: req.body.cate,
			des 			: req.body.des,
			price 			: req.body.gia,
			st 				: 0,
      congnghemanhinh:req.body.congnghemanhinh,
      dophangiai:req.body.dophangiai,
      manhinhrong:req.body.manhinhrong,
      camerasau:req.body.camerasau,
      quayphim:req.body.quayphim,
      denflash:req.body.denflash,
      chupanhnangcao:req.body.chupanhnangcao,
      cameratruoc:req.body.cameratruoc,
      videocall:req.body.videocall,
      hedieuhanh:req.body.hedieuhanh,
      chipset:req.body.chipset,
      tocdocpu:req.body.tocdocpu,
      chipdohoa:req.body.chipdohoa,
      ram:req.body.ram,
      bonhotrong:req.body.bonhotrong,
      bonhokhadung:req.body.bonhokhadung,
      thenhongoai:req.body.thenhongoai,
      mangdidong:req.body.mangdidong,
      sim:req.body.sim,
      wifi:req.body.wifi,
      gps:req.body.gps,
      bluetooth:req.body.bluetooth,
      congketnoi:req.body.congketnoi,
      jacktainghe:req.body.jacktainghe,
      thietke:req.body.thietke,
      kichthuoc:req.body.kichthuoc,
      trongluong:req.body.trongluong,
      dungluongpin:req.body.dungluongpin,
      loaipin:req.body.loaipin,
      baomat:req.body.baomat,
      radio:req.body.radio,
      xemphim:req.body.xemphim,
      nghenhac:req.body.nghenhac,
      thoidiemramat:req.body.thoidiemramat,
		});
		pro.save().then(function(){
			req.flash('success_msg', 'Đã Thêm Thành Công');
			res.redirect('/admin/product/them-product.html');
		});
	}
});

router.get('/:id/sua-product.html', checkAdmin, function (req, res) {
	Product.findById(req.params.id).then(function(data){
		Cate.find().then(function(cate){
			res.render('admin/product/sua',{errors: null, cate: cate, product: data});
		});
	});

});

router.post('/:id/sua-product.html',  cpUpload, function (req, res) {
	req.checkBody('name', 'Tên không được rổng').notEmpty();
	//req.checkBody('hinh', 'Hình không được rổng').notEmpty();
	req.checkBody('gia', 'giá phải là số').isInt();
	req.checkBody('des', 'Chi tiết không được rổng').notEmpty();

    var errors = req.validationErrors();
	if (errors) {

		var file = './public/upload/' + req.file.filename;
		var fs = require('fs');
		fs.unlink(file, function(e){
			if(e) throw e;
		 });

  		Product.findById(req.params.id).then(function(data){
			Cate.find().then(function(cate){
				res.render('admin/product/sua',{errors: errors, cate: cate, product: data});
			});
		});
	}else{
		Product.findOne({ _id: req.params.id},  function(err, data){
			var file = './public/upload/' + data.img;
			var fs = require('fs');
			fs.unlink(file, function(e){
				if(e) throw e;
			 });
			data.name 			= req.body.name;
			data.nameKhongDau 	= bodauTiengViet(req.body.name);
      data.img 			= req.files['img'][0].filename,
			data.img1 			= req.files['img1'][0].filename,
			data.cateId 		= req.body.cate;
			data.des 			= req.body.des;
			data.price 			= req.body.gia;
			data.st 			= '0';
      data.congnghemanhinh=req.body.congnghemanhinh,
      data.dophangiai=req.body.dophangiai,
      data.manhinhrong=req.body.manhinhrong,
      data.camerasau=req.body.camerasau,
      data.quayphim=req.body.quayphim,
      data.denflash=req.body.denflash,
      data.chupanhnangcao=req.body.chupanhnangcao,
      data.cameratruoc=req.body.cameratruoc,
      data.videocall=req.body.videocall,
      data.hedieuhanh=req.body.hedieuhanh,
      data.chipset=req.body.chipset,
      data.tocdocpu=req.body.tocdocpu,
      data.chipdohoa=req.body.chipdohoa,
      data.ram=req.body.ram,
      data.bonhotrong=req.body.bonhotrong,
      data.bonhokhadung=req.body.bonhokhadung,
      data.thenhongoai=req.body.thenhongoai,
      data.mangdidong=req.body.mangdidong,
      data.sim=req.body.sim,
      data.wifi=req.body.wifi,
      data.gps=req.body.gps,
      data.bluetooth=req.body.bluetooth,
      data.congketnoi=req.body.congketnoi,
      data.jacktainghe=req.body.jacktainghe,
      data.thietke=req.body.thietke,
      data.kichthuoc=req.body.kichthuoc,
      data.trongluong=req.body.trongluong,
      data.dungluongpin=req.body.dungluongpin,
      data.loaipin=req.body.loaipin,
      data.baomat=req.body.baomat,
      data.radio=req.body.radio,
      data.xemphim=req.body.xemphim,
      data.nghenhac=req.body.nghenhac,
      data.thoidiemramat=req.body.thoidiemramat
			data.save();
				req.flash('success_msg', 'Đã Sửa Thành Công');
				res.redirect('/admin/product/'+req.params.id+'/sua-product.html');
		});
	}
});

router.get('/:id/xoa-product.html',  checkAdmin, function (req, res) {
	// Product.findById(req.params.id).remove(function() {
	// 	console.log(daa);
	// 	req.flash('success_msg', 'Đã Xoá Thành Công');
	// 	res.redirect('/admin/product/danh-sach.html');
	// });

	Product.findById(req.params.id, function(err, data){
		// var file = './public/upload/' + data.img;
		// var fs = require('fs');
		// fs.unlink(file, function(e){
		// 	if(e) throw e;
		//  });
		data.remove(function(){
			req.flash('success_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/product/danh-sach.html');
		})
	});

});

function checkAdmin(req, res, next){

    if(req.isAuthenticated()){
      next();
    }else{
      res.redirect('/admin/dang-nhap.html');
    }
}

module.exports = router;
