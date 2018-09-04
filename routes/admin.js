var express = require('express');
var router = express.Router();
var ProjectModel = require('../model/projectModel');

/*

/blogs               GET   (list all blogs)
/blogs/alias         GET   (Get by alias)
/blogs               POST  (Create a new blogs)
/blogs/alias         PUT   (Update the blogs)
/blogs/alias         DELETE (remove a blogs)

*/

function urlify(str){
  var urlifyStr = str.trim().toLowerCase();
  urlifyStr = urlifyStr.replace(/ /g,'-');
  // handle for ? & - 
  return urlifyStr;
}


/* GET blog by alias. */
router.get('/:adminAlias', function(req, res, next) {
  Blog.findOne({alias: req.params.adminAlias}, function(err,admin){
    if(err){
        res.json({code: 500, message: 'Something went wrong'});
    }else if (admin){
      res.json({code: 200, data: admin});
    }
  });
});

/* Create blog. */
router.post('/', function(req, res, next) {
  var admin = req.body;
  var adminModel = new Admin();
  adminModel.name = admin.name;
  adminModel.alias = urlify(admin.name); 
  adminModel.githubUrl = admin.githubUrl;
  adminModel.image = admin.image;
  adminModel.description = admin.description;
  adminModel.tags = [];

  // var tags = project.tags.trim();
  // tags = tags.split(',');
  // for(var i=0; i<tags.length; i++){
  //     projectModel.tags.push({'name':tags[i], 'class': 'info' });
  // }

  adminModel.imageSliders = admin.imageSliders;
  adminModel.relatedAdmin = admin.relatedAdmins;
  adminModel.createAt = new Date();
  adminModel.save(function(err, admin){
      if(err){
        res.json({code: 500, message: 'Something went wrong'});
      }else{
        res.json({code: 200, data: admin}); 
      }
  });
});

/* Create blog. 
router.put('/:adminAlias', function(req, res, next) {
  var bObject = req.body;

  Vlog.findOne({'alias': adminAlias}, function(err, admin){
    if(err){
        callback(err, null);
    }else{

        console.log(JSON.stringify(admin));
        if(aObject.name){
            blog.name = bObject.name;
        }
        if(aObject.image){
            blog.image = bObject.image;
        }
        if(bObject.description){
            blog.description = bObject.description;
        }
        if(bObject.githubUrl){
            blog.githubUrl = bObject.githubUrl;
        }
        
        blog.save(function(err, blog){
            console.log(JSON.stringify(blog));
            if(err){
              res.json({code: 500, message: 'Something went wrong'});
            }else{
              res.json({code: 200, data: blog}); 
            }
        });
    }
  });
}); */

/* Create blog. */
router.delete('/:adminAlias', function(req, res, next) {
  Admin.remove({'alias': req.params.adminAlias}, function(err, admin){
    if(err){
      res.json({code: 500, message: 'Something went wrong'});
    }else{
      res.json({code: 200, data: admin}); 
    }
  });
});

router.post('/projects/:projectAlias/update', function(req, res, next){
  var body = req.body;
  var newProjectData = new ProjectModel();
  newProjectData = {
    name: body.name,
    alias: urlify(body.name),
    githubUrl: body.githubUrl,
    description: body.description
  };
  console.log(newProjectData);
  newProjectData.updateOne({"alias":req.params.projectAlias}, newProjectData, function(err, project){
    if(!err){
      res.json({code: 200, data:project});
    }
    else{
      res.json({code: 500, message: 'Something went wrong'});
    }
  });

});


module.exports = router;
