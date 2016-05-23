var HomeLayer = cc.Layer.extend({
    //层的构造函数 
    ctor:function(){
        //调用父类的构造函数 
        this._super();

        //选中的音乐
        this.mode = 4;  
        this.musicName = null;
        this.musicBeatMap = null;

        //加载plist文件
        cc.spriteFrameCache.addSpriteFrames(res.s_Background_plist);
        cc.spriteFrameCache.addSpriteFrames(res.s_Button_plist); 

        //获取界面尺寸
        var winSize = cc.director.getWinSize(); 

        //设置背景图片
        var pSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("bg2.png"));
        pSprite.setScale(2);
        pSprite.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        this.addChild(pSprite, 0);

        //设置“节奏大师”的logo
        var gameLogo = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("jiezoudashilogo.png"));
        gameLogo.setPosition(winSize.width / 2 , winSize.height - 80);
        this.addChild(gameLogo, 1);


        //设置游戏模式选项
        var key4SpriteButton = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("key_button_4.png"));
        var key5SpriteButton = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("key_button_5.png"));
        var key6SpriteButton = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("key_button_6.png"));

        var game4KeyMenu = cc.MenuItemSprite.create( key4SpriteButton, null, null, this.Game4KeyItemCallBack, this);
        var game5KeyMenu = cc.MenuItemSprite.create( key5SpriteButton, null, null, this.Game5KeyItemCallBack, this);
        var game6KeyMenu = cc.MenuItemSprite.create( key6SpriteButton, null, null, this.Game6KeyItemCallBack, this);

        var menu = new cc.Menu(game4KeyMenu, game5KeyMenu, game6KeyMenu, null);
        menu.setPosition(winSize.width / 4, winSize.height / 2 - 50);
        menu.alignItemsVerticallyWithPadding(80);
        this.addChild(menu, 1);

        //
        this.label1 = cc.LabelTTF.create("已选模式：", "Arial", 30, null, null, null);
        this.label1.setPosition(winSize.width / 20 * 2, 40);
        this.addChild(this.label1);
        this.label2 = cc.LabelTTF.create("4Key模式", "Arial", 20, null, null, null);
        this.label2.setAnchorPoint(0, 0.5);
        this.label2.setPosition(this.label1.x + 100 , this.label1.y);
        this.addChild(this.label2);

        //
        this.label3 = cc.LabelTTF.create("已选歌曲：", "Arial", 30, null, null, null);
        this.label3.setPosition(winSize.width / 20 * 8, 40);
        this.addChild(this.label3);
        this.label4 = cc.LabelTTF.create("无", "Arial", 20, null, null, null);
        this.label4.setAnchorPoint(0, 0.5);
        this.label4.setPosition(this.label3.x + 100 , this.label3.y);
        this.addChild(this.label4);


        var startGameItem = new cc.MenuItemImage(cc.spriteFrameCache.getSpriteFrame("start.png"), null, null, this.startGameCallBack,this);
        var startGameMenu = new cc.Menu(startGameItem);
        startGameMenu.setPosition(winSize.width / 20 * 17 + 20, 50);
        this.addChild(startGameMenu, 1);


        this.musicArray = [
            {
                "name" : "爱情买卖-慕容晓晓", 
                "musicName" : res.s_aiqingmaimai_mp3,
                "musicBeatMap" : res.s_aiqingmaimai_4k_nm_json,
                "musicImage" : res.s_aiqingmaimai_png,
            },
            {
                "name" : "Andy-阿杜", 
                "musicName" : res.s_andy_mp3, 
                "musicBeatMap" : res.s_andy_4k_ez_json,
                "musicImage" : res.s_andy_png,
            },
            {
                "name" : "贝多芬病毒", 
                "musicName" : res.s_beiduofenbingdu_mp3, 
                "musicBeatMap" : res.s_beiduofenbingdu_4k_ez_json,
                "musicImage" : res.s_beiduofenbingdu_png,
            },        
        ];

         // Create the list view
        this.listView = new ccui.ListView();
            // set list view ex direction
        this.listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.listView.setTouchEnabled(true);
        this.listView.setBounceEnabled(true);
        //listView.setBackGroundImage(res.s_Andy_png);
        //listView.setBackGroundImageScale9Enabled(true);
        this.listView.setContentSize(cc.size(200, 300));
        this.listView.setAnchorPoint(0.5, 0.5);
        this.listView.x = winSize.width / 4 * 3;
        this.listView.y = winSize.height / 2 - 50 ;
        this.listView.addEventListener(this.listViewCallBack, this);
        this.addChild(this.listView, 10);

        // create model
        var default_button = new ccui.Button();
        default_button.setName("TextButton");
        default_button.setTouchEnabled(true);
        default_button.loadTextures(res.s_ItemBg1_png, res.s_ItemBg2_png, res.s_ItemBg2_png);
        default_button.setContentSize(cc.size(100, 30));
        // add default item
        var count = this.musicArray.length;
        // add custom item
        for (var i = 0; i < count; ++i) {
            var custom_button = new ccui.Button();
            custom_button.setName("TextButton");
            custom_button.setTouchEnabled(true);
            custom_button.setScale9Enabled(true);
            custom_button.loadTextures(res.s_ItemBg1_png, res.s_ItemBg2_png, res.s_ItemBg2_png);
            custom_button.setContentSize(default_button.getContentSize());

            var custom_item = new ccui.Layout();
            custom_item.setContentSize(custom_button.getContentSize());
            custom_item.width = this.listView.width;
            custom_button.x = custom_item.width / 2;
            custom_button.y = custom_item.height / 2;
            custom_item.addChild(custom_button);

            this.listView.pushBackCustomItem(custom_item);
        }
            // set item data
        var items_count = this.listView.getItems().length;
        for (var i = 0; i < items_count; ++i) {
            var item = this.listView.getItem(i);
            var button = item.getChildByName("TextButton");
            var index = this.listView.getIndex(item);
            button.setTitleColor(cc.color(0,0,0,255));
            button.setTitleText(this.musicArray[index].name);
        }

            
            // remove last item
            //listView.removeLastItem();

            // remove item by index
           // items_count = listView.getItems().length;
            //listView.removeItem(items_count - 1);

            // set all items layout gravity
            this.listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

            
        //播放背景音乐
        cc.audioEngine.playMusic(res.s_Backgroundmusic, true);
        return true;
    },
    
    listViewCallBack:function(sender, type){
        cc.audioEngine.playEffect(res.s_MusicSelect01,false);
        var listViewEx = sender;
        this.musicName = this.musicArray[listViewEx.getCurSelectedIndex()].musicName;
        this.musicBeatMap = this.musicArray[listViewEx.getCurSelectedIndex()].musicBeatMap;
        this.musicImage = this.musicArray[listViewEx.getCurSelectedIndex()].musicImage;
        var item = this.listView.getItem(listViewEx.getCurSelectedIndex());
        var button = item.getChildByName("TextButton");
        this.label4.setString(button.getTitleText());
    },

    Game4KeyItemCallBack:function()
    {
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        this.label2.setString("4Key模式");
        this.label4.setString("无");
        this.musicName == null；
        this.mode = 4;
        this.musicArray = [
            {
                "name" : "爱情买卖-慕容晓晓", 
                "musicName" : res.s_aiqingmaimai_mp3,
                "musicBeatMap" : res.s_aiqingmaimai_4k_nm_json,
                "musicImage" : res.s_aiqingmaimai_png,
            },
            {
                "name" : "Andy-阿杜", 
                "musicName" : res.s_andy_mp3, 
                "musicBeatMap" : res.s_andy_4k_ez_json,
                "musicImage" : res.s_andy_png,
            },
            {
                "name" : "贝多芬病毒", 
                "musicName" : res.s_beiduofenbingdu_mp3, 
                "musicBeatMap" : res.s_beiduofenbingdu_4k_ez_json,
                "musicImage" : res.s_beiduofenbingdu_png,
            },
        ];
        var items_count = this.listView.getItems().length;
        for (var i = 0; i < items_count; ++i) {
            var item = this.listView.getItem(i);
            var button = item.getChildByName("TextButton");
            var index = this.listView.getIndex(item);
            button.setTitleColor(cc.color(0,0,0,255));
            button.setTitleText(this.musicArray[index].name);
        }
    },

    Game5KeyItemCallBack:function()
    {
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        this.label2.setString("5Key模式");
        this.label4.setString("无");
        this.musicName == null；
        this.mode = 5;
        this.musicArray = [
            {
                "name" : "不潮不用花钱-林俊杰", 
                "musicName" : res.s_buchaobuyaohuaqian_mp3,
                "musicBeatMap" : res.s_buchaobuyaohuaqian_5k_nm_json,
                "musicImage" : res.s_buchaobuyaohuaqian_png,
            },
            {
                "name" : "曹操-林俊杰", 
                "musicName" : res.s_caocao_mp3, 
                "musicBeatMap" : res.s_caocao_5k_nm_json,
                "musicImage" : res.s_caocao_png,
            },
            {
                "name" : "daybyday-T-ara", 
                "musicName" : res.s_daybyday_mp3, 
                "musicBeatMap" : res.s_daybyday_5k_nm_json,
                "musicImage" : res.s_daybyday_png,
            },
        ];
        var items_count = this.listView.getItems().length;
        for (var i = 0; i < items_count; ++i) {
            var item = this.listView.getItem(i);
            var button = item.getChildByName("TextButton");
            var index = this.listView.getIndex(item);
            button.setTitleColor(cc.color(0,0,0,255));
            button.setTitleText(this.musicArray[index].name);
        }
    },

    Game6KeyItemCallBack:function()
    {
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        this.label2.setString("6Key模式");
        this.label4.setString("无");
        this.musicName == null；
        this.mode = 6;
        this.musicArray = [
            {
                "name" : "彩色的黑-吉克隽逸", 
                "musicName" : res.s_caisedehei_mp3,
                "musicBeatMap" : res.s_caisedehei_6k_nm_json,
                "musicImage" : res.s_caisedehei_png,
            },
            {
                "name" : "少女时代", 
                "musicName" : res.s_shaonvshidai_mp3, 
                "musicBeatMap" : res.s_shaonvshidai_6k_nm_json,
                "musicImage" : res.s_shaonvshidai_png,
            },
            {
                "name" : "武林盟主-苏醒", 
                "musicName" : res.s_wulinmengzhu_mp3, 
                "musicBeatMap" : res.s_wulinmengzhu_6k_nm_json,
                "musicImage" : res.s_wulinmengzhu_png,
            },
        ];
        var items_count = this.listView.getItems().length;
        for (var i = 0; i < items_count; ++i) {
            var item = this.listView.getItem(i);
            var button = item.getChildByName("TextButton");
            var index = this.listView.getIndex(item);
            button.setTitleColor(cc.color(0,0,0,255));
            button.setTitleText(this.musicArray[index].name);
        }
    },

    startGameCallBack:function() {
        // body...
        if(this.musicName == null ){
            cc.audioEngine.playEffect(res.s_Error,false);
            var width = 250;
            var height = 200;
            var winSize = cc.director.getWinSize();
            var scene = this.getParent(); 
            var pauseGround = new cc.LayerColor(cc.color(0, 0, 0, 50));
            scene.addChild(pauseGround, 1, 2);
            var selectGround = new cc.LayerColor(cc.color(0, 0, 0, 120), width, height);
            selectGround.setPosition(winSize.width/2 -  width/2, winSize.height/2 - height/2);
            scene.addChild(selectGround, 1, 3);
            

            var label1 = cc.LabelTTF.create("点击返回选择歌曲", "Arial", 25, null, null, null);

            var labelItem1 = cc.MenuItemSprite.create( label1, null, null, this.returnCallback, this);

            var menu = new cc.Menu(labelItem1, null);
            menu.alignItemsVerticallyWithPadding(30);
            menu.setPosition(selectGround.width / 2, selectGround.height / 2);
            selectGround.addChild(menu, 12);

            scene.layerPause(this);
            
        }
        else{
            //播放音乐特效
            cc.audioEngine.playEffect(res.s_MusicStart,false);
            if(this.mode == 4){
                var newScene = new Game4KeyScene();
            }
            else if (this.mode == 5){
                var newScene = new Game5KeyScene();
            }
            else{
                var newScene = new Game6KeyScene();
            }
            //切换至Game场景        
            newScene.musicName = this.musicName;
            newScene.musicBeatMap = this.musicBeatMap;
            newScene.musicImage = this.musicImage;
            cc.director.runScene(newScene);
        }
    },

    returnCallback:function(){
        var scene = this.getParent();
        scene.getChildByTag(2).removeFromParent(true);
        scene.getChildByTag(3).removeFromParent(true);
        scene.layerResume(this);
    },

});

//创建首页场景类
var Home = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HomeLayer();
        this.addChild(layer, 1, 1);
    },
    layerPause:function(target){
        if (target != null) {
            var children = target.getChildren();
            if (children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                         this.layerPause(children[i]);
                }
             }
            target.pause();
        }
    },
    layerResume:function(target){
         if (target != null) {
            var children = target.getChildren();
            if (children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                         this.layerResume(children[i]);
                }
             }
            target.resume();
        }
    },
});
