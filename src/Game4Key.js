var game4KeyLayer = cc.Layer.extend({
    //层的构造函数 
    ctor:function(musicName, musicBeatMap, musicImage) {
        // body...
        this._super();
        this.bornFlag = true;
        this.pauseTimestamp = 0;

        this.musicName = musicName;
        this.musicBeatMap = musicBeatMap;
        this.musicImage = musicImage;
        this.musicTime = null;

        //加载谱面
        var self = this;
        this.rhythm = null;
        this.rhythmIndex = 0;
        cc.loader.load(this.musicBeatMap, function(err, results){
            if(err){
                return;
            }   
            self.rhythm = results[0].rhythm;  //读取note的时候信息
            self.musicTime = results[0].allTime;  //读取歌曲的总时间
        });        
        
        //一些base参数
        var winSize = cc.director.getWinSize();
        var perKeyW = winSize.width / 8;
        this.perNoteBottom_X = perKeyW;
        this.speed = 1;
        this.score = 0;
        this.curCombo = 0;

        //触摸区域
        this.key1Rect = cc.rect(0, 0, perKeyW * 2, winSize.height / 2);
        this.key2Rect = cc.rect(perKeyW * 2, 0, perKeyW * 2, winSize.height / 2);
        this.key3Rect = cc.rect(perKeyW * 4, 0, perKeyW * 2, winSize.height / 2);
        this.key4Rect = cc.rect(perKeyW * 6, 0, perKeyW * 2, winSize.height / 2);

        //当前背景图片
        var pSprite = new cc.Sprite(this.musicImage);
        pSprite.setScale(2);
        pSprite.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(pSprite, 0);

        //note滑道
        var panlGameSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("panl_game.png"));
        panlGameSprite.setScale(2.3);
        panlGameSprite.setAnchorPoint(0.5,1);
        panlGameSprite.setPosition(winSize.width/2,winSize.height - 15);
        this.addChild(panlGameSprite, 1);

        //rhythm按键槽
        var panl4KSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("panl_4k.png"));
        panl4KSprite.setScale(2);
        panl4KSprite.setPosition(winSize.width/2, 60);
        this.addChild(panl4KSprite, 1);

        //note出生位置
        this.bornNotePos0_0 = cc.p(panlGameSprite.x - 40, winSize.height + 30);
        this.bornNotePos1_0 = cc.p(panlGameSprite.x - 20, winSize.height + 30);
        this.bornNotePos2_0 = cc.p(panlGameSprite.x + 10, winSize.height + 30);
        this.bornNotePos3_0 = cc.p(panlGameSprite.x + 40, winSize.height + 30);

        this.bornNotePos0_1 = cc.p(panlGameSprite.x - 40, winSize.height);
        this.bornNotePos1_1 = cc.p(panlGameSprite.x - 20, winSize.height);
        this.bornNotePos2_1 = cc.p(panlGameSprite.x + 10, winSize.height);
        this.bornNotePos3_1 = cc.p(panlGameSprite.x + 40, winSize.height);

        this.bornNotePos0_2 = cc.p(this.perNoteBottom_X * 1 - 50, 0);
        this.bornNotePos1_2 = cc.p(this.perNoteBottom_X * 3 - 15, 0);
        this.bornNotePos2_2 = cc.p(this.perNoteBottom_X * 5 + 20, 0);
        this.bornNotePos3_2 = cc.p(this.perNoteBottom_X * 7 + 50, 0);

        //note滑道边缘线
        lSide = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("b_side.png"));
        rSide = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("b_side.png"));
        sider_1 = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("b_sider.png"));
        sider_2 = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("b_sider.png"));
        sider_3 = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("b_sider.png"));

        lSide.setAnchorPoint(0, 0);
        lSide.setScale(2);
        lSide.setPosition(-20, 90);
        lSide.setRotation(37.5);
        this.addChild(lSide, 4);

        rSide.setAnchorPoint(1, 0);
        rSide.setScale(2);
        rSide.setPosition(winSize.width + 20, 90);
        rSide.setRotation(-37.5);
        this.addChild(rSide, 4);

        //note滑道间隔线
        sider_1.setAnchorPoint(0.5, 1);
        sider_2.setAnchorPoint(0.5, 1);
        sider_3.setAnchorPoint(0.5, 1);
        sider_1.setScale(1.88);
        sider_2.setScale(1.75);
        sider_3.setScale(1.87);
        sider_1.setRotation(20.25);
        sider_3.setRotation(-20.5);
        sider_1.setPosition(panlGameSprite.x - 30, panlGameSprite.y); 
        sider_2.setPosition(panlGameSprite.x + 2, panlGameSprite.y);
        sider_3.setPosition(panlGameSprite.x + 35 , panlGameSprite.y);    
        this.addChild(sider_1, 4);
        this.addChild(sider_2, 4);
        this.addChild(sider_3, 4);

        //生命槽
        var top = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("top.png"));
        top.setPosition(winSize.width / 2, winSize.height - 60);
        top.setScale(2);
        this.addChild(top, 5);

        //生命值
        this.life = 100;
        this.lifeBar = cc.ProgressTimer.create(new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("hp.png")));
        this.lifeBar.setType(cc.ProgressTimer.TYPE_BAR);
        this.lifeBar.setMidpoint(cc.p(0, 0.5));
        this.lifeBar.setBarChangeRate(cc.p(1, 0));
        this.lifeBar.setPosition(top.x - 311, top.y + 25);
        this.lifeBar.setScale(2.15);
        this.lifeBar.runAction(cc.ProgressTo.create(0.5, this.life));
        this.addChild(this.lifeBar, 5);

        //进度条
        this.jinduBar = cc.ProgressTimer.create(new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("jindu.png")));
        this.jinduBar.setType(cc.ProgressTimer.TYPE_BAR);
        this.jinduBar.setMidpoint(cc.p(0, 0.5));
        this.jinduBar.setBarChangeRate(cc.p(1, 0));
        this.jinduBar.setScale(2);
        this.jinduBar.setPosition(winSize.width/2, winSize.height - 2);
        var progressTo = cc.ProgressTo.create(this.musicTime/1000, 100); 
        var seq = cc.Sequence.create(progressTo, cc.CallFunc.create(this.jinduBarCallback, this));
        this.jinduBar.runAction(seq);
        this.addChild(this.jinduBar, 100);

        //返回键
        var pCloseItem = new cc.MenuItemImage(res.s_Buttonsy_jpg,res.s_Buttonsy1_jpg, 
            res.s_Buttonsy_jpg, this.returnHomeCallback,this);
        pCloseItem.setScale(0.4);
        var pMenu = new cc.Menu(pCloseItem);
        pMenu.setPosition(winSize.width - 45, winSize.height - 120);
        this.addChild(pMenu, 1);

        //rhythm按键
        this.bottomButton0_1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_0_1.png"));
        this.bottomButton0_1.setPosition(perKeyW + 15, panl4KSprite.y + 20);
        this.bottomButton0_1.setScale(2.5);
        this.addChild(this.bottomButton0_1, 3);
       
        this.bottomButton0_2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_0_2.png"));
        this.bottomButton0_2.setPosition(perKeyW * 3 + 5, panl4KSprite.y + 20);
        this.bottomButton0_2.setScale(2.5);
        this.addChild(this.bottomButton0_2, 3);
        
        this.bottomButton0_3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_0_3.png"));
        this.bottomButton0_3.setPosition(perKeyW * 5 - 5, panl4KSprite.y + 20);
        this.bottomButton0_3.setScale(2.5);
        this.addChild(this.bottomButton0_3, 3);

        this.bottomButton0_4 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_0_4.png"));
        this.bottomButton0_4.setPosition(perKeyW * 7 - 15, panl4KSprite.y + 20);
        this.bottomButton0_4.setScale(2.5);
        this.addChild(this.bottomButton0_4, 3);

        //rhythm按键特效
        this.bottomButton1_1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_1_1.png"));
        this.bottomButton1_1.setPosition(perKeyW + 15, panl4KSprite.y + 20);
        this.bottomButton1_1.setScale(2.5);
        this.addChild(this.bottomButton1_1, -10);
       
        this.bottomButton1_2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_1_2.png"));
        this.bottomButton1_2.setPosition(perKeyW * 3 + 5, panl4KSprite.y + 20);
        this.bottomButton1_2.setScale(2.5);
        this.addChild(this.bottomButton1_2, -10);
        
        this.bottomButton1_3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_1_3.png"));
        this.bottomButton1_3.setPosition(perKeyW * 5 - 5, panl4KSprite.y + 20);
        this.bottomButton1_3.setScale(2.5);
        this.addChild(this.bottomButton1_3, -10);

        this.bottomButton1_4 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("button_4key_1_4.png"));
        this.bottomButton1_4.setPosition(perKeyW * 7 - 15, panl4KSprite.y + 20);
        this.bottomButton1_4.setScale(2.5);
        this.addChild(this.bottomButton1_4, -10);

        //comble 连击计数特效 
        var comble = new cc.LabelBMFont("", res.s_Futura);
        comble.setPosition(winSize.width / 2, winSize.height / 2 + 30);
        this.addChild(comble, 10, 10);

        //score  分数
        var sBottom= top;
        var scoreLable = new cc.LabelAtlas("0", res.s_Jinscore_plist);
        scoreLable.setScale(1.5);
        scoreLable.setPosition(winSize.width - 120, sBottom.y);
        this.addChild(scoreLable, 10, 11);

        //暂停按钮  
        var pauseItem = new cc.MenuItemImage(cc.spriteFrameCache.getSpriteFrame("pause_1.png"), cc.spriteFrameCache.getSpriteFrame("pause_2.png"), 
            cc.spriteFrameCache.getSpriteFrame("pause_2.png"), this.pauseItemCallback,this);
        pauseItem.setScale(2);
        var pauseMenu = new cc.Menu(pauseItem);
        pauseMenu.setPosition(winSize.width - 35, sBottom.y + 15);
        this.addChild(pauseMenu, 5);

        //击中区域划分
        var buttonx = this.bottomButton0_1.x;
        var buttony = this.bottomButton0_1.y;
        var buttonWidth = this.bottomButton0_1.width;
        var buttonHeight = this.bottomButton0_1.height;

        this.greatRect = cc.rect(buttonx, buttony + buttonHeight, buttonWidth, buttonHeight * 3);
        this.betterRect1 = cc.rect(buttonx, buttony + buttonHeight, buttonWidth, buttonHeight);
        this.perfectRect = cc.rect(buttonx, buttony, buttonWidth, buttonHeight);
        this.betterRect2 = cc.rect(buttonx, buttony - buttonHeight, buttonWidth, buttonHeight);
        
        //添加一个监听函数，监听当前层
        this.touchKey;     //被触摸的按键
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,                      // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: this.onTouchBegan,            //设置开始触摸处理函数
            onTouchMoved: this.onTouchMoved,            //设置移动触摸处理函数
            onTouchEnded: this.onTouchEnded,            //设置结束触摸处理函数
            onTouchCancelled: this.onTouchCancelled     //设置取消触摸处理函数
        },this); 

        var self = this;                                       //监听目标为整个层面
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed,
            onKeyReleased: this.onKeyReleased,
        }, this); 

        //播放音乐
        this.startScale = 0.3;
        this.endScale = 3;
        this.note = null;
        this.spawn = null;
        this.seq = null;
        this.interval = 0;
        this.nowTime = 0;
        this.baseTimestamp = new Date().getTime();
        cc.audioEngine.playMusic(this.musicName, false);
        for (; this.rhythmIndex < 10; this.rhythmIndex++){
            this.born();
        }
        return true;
    },

    //note生成函数 
    born:function(){
        if(this.bornFlag == true){
        var onePosition = null;
        var twoPosition = null;
        var threePosition = null;
        var image = null;
        var addSore = null;
        if (this.rhythm[this.rhythmIndex].p == 0){          
            onePositon = this.bornNotePos0_0;
            twoPosition = this.bornNotePos0_1;
            threePosition = this.bornNotePos0_2;
            image = "button_4key_3_1.png";
            addSore = 1;
        }
        else if (this.rhythm[this.rhythmIndex].p == 1){
            onePositon = this.bornNotePos1_0;
            twoPosition = this.bornNotePos1_1;
            threePosition = this.bornNotePos1_2;
            image = "button_4key_3_2.png";
            addSore = 2;
        }
        else if (this.rhythm[this.rhythmIndex].p == 2){
            onePositon = this.bornNotePos2_0;
            twoPosition = this.bornNotePos2_1;
            threePosition = this.bornNotePos2_2;
            image = "button_4key_3_3.png";
            addSore = 3;
        }
        else{
            onePositon = this.bornNotePos3_0;
            twoPosition = this.bornNotePos3_1;
            threePosition = this.bornNotePos3_2;
            image = "button_4key_3_4.png";
            addSore = 4;
        }
        this.note = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(image));
        this.note.setPosition(onePositon);
        this.note.setScale(this.startScale); 
        this.spawn = cc.Spawn.create(cc.ScaleTo.create(this.speed, this.endScale),
        new cc.moveTo(this.speed, cc.p(threePosition)));
        this.nowTime = new Date().getTime();
        this.interval = this.nowTime - this.baseTimestamp;
        this.seq = cc.Sequence.create(new cc.moveTo((this.rhythm[this.rhythmIndex].t - 1 - (this.interval * 0.001)),
        cc.p(twoPosition)),this.spawn, cc.CallFunc.create(this.pCallback, this,  this.note));
        this.note.runAction(this.seq);
        this.addChild(this.note, 4, addSore);
        }
    },
    
    //暂停游戏键的回调函数
    pauseItemCallback:function(){
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        var width = 300;
        var height = 400;
        var winSize = cc.director.getWinSize();
        var scene = this.getParent(); 
        var pauseGround = new cc.LayerColor(cc.color(0, 0, 0, 50));
        scene.addChild(pauseGround, 1, 2);
        var selectGround = new cc.LayerColor(cc.color(0, 0, 0, 100), width, height);
        selectGround.setPosition(winSize.width/2 -  width/2, winSize.height/2 - height/2);
        scene.addChild(selectGround, 1, 3);

        var label1 = cc.LabelTTF.create("继续游戏", "Arial", 40, null, null, null);
        var label2 = cc.LabelTTF.create("重新开始", "Arial", 40, null, null, null);
        var label3 = cc.LabelTTF.create("返回首页", "Arial", 40, null, null, null);

        var labelItem1 = cc.MenuItemSprite.create( label1, null, null, this.resumeItemCallback, this);
        var labelItem2 = cc.MenuItemSprite.create( label2, null, null, this.restartGameCallback, this);
        var labelItem3 = cc.MenuItemSprite.create( label3, null, null, this.returnHomeCallback, this);

        var menu = new cc.Menu(labelItem1, labelItem2, labelItem3, null);
        menu.alignItemsVerticallyWithPadding(30);
        menu.setPosition(selectGround.width / 2, selectGround.height / 2);
        selectGround.addChild(menu, 1);

        this.pauseTimestamp = new Date().getTime();
        cc.audioEngine.pauseMusic(); 
        scene.layerPause(this);     
    },

    //恢复游戏键的回调函数
    resumeItemCallback:function(){
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        var scene = this.getParent();
        scene.layerResume(this);
        this.baseTimestamp = this.baseTimestamp + ( new Date().getTime() - this.pauseTimestamp);　
        cc.audioEngine.resumeMusic();
        scene.getChildByTag(2).removeFromParent(true);
        scene.getChildByTag(3).removeFromParent(true);
    },
    //重新开始键的回调函数
    restartGameCallback:function(){
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        var musicName = this.musicName;
        var musicBeatMap = this.musicBeatMap;
        var musicImage = this.musicImage;
        var scene = this.getParent();
        scene.getChildByTag(2).removeFromParent(true);
        scene.getChildByTag(3).removeFromParent(true);
        this.removeFromParent(true);
        var layer = new game4KeyLayer(musicName, musicBeatMap, musicImage);
        scene.addChild(layer);
    },

    returnHomeCallback:function()
    {
        cc.audioEngine.playEffect(res.s_ModeSelect02,false);
        cc.director.runScene(new Home);
    },

    //特效的回调函数 
    pCallback:function(object){
        var winSize = cc.director.getWinSize();
        this.curCombo = 0;
        var curCombLable = this.getChildByTag(10);
        curCombLable.setString("");

        var miss = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("s_miss.png"));
        miss.setPosition(winSize.width/2, winSize.height/2 + 150);
        miss.setScale(0.5);
        this.addChild(miss, 4);
        var seq = cc.Sequence.create(cc.ScaleTo.create(0.2, 2.5), cc.CallFunc.create(this.s_pCallback, this, miss));
        miss.runAction(seq);
        
        this.life = this.life - 5;
        this.lifeBar.runAction(cc.ProgressTo.create(0.1, this.life));
        if(this.life <= -5000){
            cc.audioEngine.playEffect(res.s_YouLose,false);
            this.bornFlag = false;
            var width = 300;
            var height = 400;
            var winSize = cc.director.getWinSize();
            var scene = this.getParent(); 
            var pauseGround = new cc.LayerColor(cc.color(0, 0, 0, 50));
            scene.addChild(pauseGround, 1, 2);
            var selectGround = new cc.LayerColor(cc.color(0, 0, 0, 100), width, height);
            selectGround.setPosition(winSize.width/2 -  width/2, winSize.height/2 - height/2);
            scene.addChild(selectGround, 1, 3);

            var label1 = cc.LabelTTF.create("失败", "Arial", 60, null, null, null);
            var label2 = cc.LabelTTF.create("再玩一次", "Arial", 40, null, null, null);
            var label3 = cc.LabelTTF.create("返回首页", "Arial", 40, null, null, null);

            var labelItem1 = cc.MenuItemSprite.create( label1, null, null, null, this);
            var labelItem2 = cc.MenuItemSprite.create( label2, null, null, this.restartGameCallback, this);
            var labelItem3 = cc.MenuItemSprite.create( label3, null, null, this.returnHomeCallback, this);

            var menu = new cc.Menu(labelItem1, labelItem2, labelItem3, null);
            menu.alignItemsVerticallyWithPadding(30);
            menu.setPosition(selectGround.width / 2, selectGround.height / 2);
            selectGround.addChild(menu, 1);
            cc.audioEngine.pauseMusic();
            scene.layerPause(this);       
        }

        if (this.rhythmIndex < (this.rhythm.length - 1)) {
            this.born();    
            this.rhythmIndex++;       
        }
        object.removeFromParent(true);
    },

    //判断触摸点函数 
    containsTouchLocation:function(touch) {
        if (cc.rectContainsPoint(this.key1Rect, touch)) {
            return 1;
        }
        if (cc.rectContainsPoint(this.key2Rect, touch)) {
            return 2;
        }
        if (cc.rectContainsPoint(this.key3Rect, touch)) {
            return 3;
        }
        if (cc.rectContainsPoint(this.key4Rect, touch)) {
            return 4;
        }
        return 0;
    },

    //检查是否击中note函数 
    checkScore:function(pNode) {
        var checkid=0;
        if (pNode == null) {
            return checkid;
        }
        var s_y = pNode.getPosition().y - 10;
        var s_grect_maxy = cc.rectGetMinY(this.greatRect);
        var s_grect_miny = cc.rectGetMinY(this.greatRect);
        var s_brect1_maxy = cc.rectGetMaxY(this.betterRect1);
        var s_brect1_miny = cc.rectGetMinY(this.betterRect1);
        var s_prect_maxy = cc.rectGetMaxY(this.perfectRect);
        var s_prect_miny = cc.rectGetMinY(this.perfectRect);
        var s_brect2_maxy = cc.rectGetMaxY(this.betterRect2);
        var s_brect2_miny = cc.rectGetMinY(this.betterRect2);

        if (s_y >= s_grect_miny && s_y <= s_grect_maxy) { //大perfect
            checkid = 3;
            pNode.removeFromParent(true);
             if (this.rhythmIndex < (this.rhythm.length - 1)) {
                this.born(); 
                this.rhythmIndex++;       
            }
        } else if (s_y >= s_brect1_miny && s_y <= s_brect1_maxy) { //小perfect
            checkid = 2;
            pNode.removeFromParent(true);
             if (this.rhythmIndex < (this.rhythm.length - 1)) {
                this.born();
                this.rhythmIndex++;           
            }
        } else if (s_y >= s_prect_miny && s_y <= s_prect_maxy) { //great
            checkid = 1;
            pNode.removeFromParent(true);
             if (this.rhythmIndex < (this.rhythm.length - 1)) {
                this.born();   
                this.rhythmIndex++;        
            }
        } else if (s_y >= s_brect2_miny && s_y <= s_brect2_maxy) { //great
            checkid = 2;
            pNode.removeFromParent(true);
             if (this.rhythmIndex < (this.rhythm.length - 1)) {
                this.born();  
                this.rhythmIndex++;          
            }
        }else { //miss
            checkid = 0;
        }
        return checkid;
    },

    //检查分数函数 
    showCombo:function(id) {
        if (id == 0) {
            return;
        }
        var s_p;
        var winSize = cc.director.getWinSize();
        if (id == 1) {
            s_p = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("s_bperfect.png"));
            this.score += 200;
            this.curCombo++;
        }
        if (id == 2) {
            s_p = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("s_perfect.png"));
            this.score += 150;
            this.curCombo++;
        }
        if (id == 3) {
            s_p = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("s_great.png"));
            this.score += 100;
            this.curCombo++;
        }
        if(s_p != null){
            s_p.setPosition(winSize.width/2, winSize.height/2 + 150);
            s_p.setScale(0.5);
            this.addChild(s_p, 4);
            var seq = cc.Sequence.create(cc.ScaleTo.create(0.2, 2.5), cc.CallFunc.create(this.s_pCallback, this,  s_p));
            s_p.runAction(seq);

            var scoreLable = this.getChildByTag(11);
            if(this.score>9&&this.score<99)
                scoreLable.setPosition(winSize.width - 150, scoreLable.y);
            if(this.score>99&&this.score<999)
                scoreLable.setPosition(winSize.width - 180, scoreLable.y);
            if(this.score>999&&this.score<9999)
                scoreLable.setPosition(winSize.width - 210, scoreLable.y);
            if(this.score>9999&&this.score<99999)
                scoreLable.setPosition(winSize.width - 240, scoreLable.y);
            scoreLable.setString(parseInt(this.score));
        }
        var curCombLable = this.getChildByTag(10);
        curCombLable.setString(parseInt(this.curCombo));
    },

    //prefect等待特效的回调函数
    s_pCallback:function(object){
        object.removeFromParent(true);
    },

    //切换精灵的层次函数
    zOrderSprite:function(sprite1, sprite2) {
        this.reorderChild(sprite1, -10);
        this.reorderChild(sprite2, 3);
    },

    jinduBarCallback:function(){
        cc.audioEngine.playEffect(res.s_YouWin,false);
        var width = 300;
        var height = 400;
        var winSize = cc.director.getWinSize();
        var scene = this.getParent(); 
        var pauseGround = new cc.LayerColor(cc.color(0, 0, 0, 50));
        scene.addChild(pauseGround, 1, 2);
        var selectGround = new cc.LayerColor(cc.color(0, 0, 0, 100), width, height);
        selectGround.setPosition(winSize.width/2 -  width/2, winSize.height/2 - height/2);
        scene.addChild(selectGround, 1, 3);

        var label1 = cc.LabelTTF.create("成功", "Arial", 60, null, null, null);
        var label2 = cc.LabelTTF.create("再玩一次", "Arial", 40, null, null, null);
        var label3 = cc.LabelTTF.create("返回首页", "Arial", 40, null, null, null);

        var labelItem1 = cc.MenuItemSprite.create( label1, null, null, null, this);
        var labelItem2 = cc.MenuItemSprite.create( label2, null, null, this.restartGameCallback, this);
        var labelItem3 = cc.MenuItemSprite.create( label3, null, null, this.returnHomeCallback, this);

        var menu = new cc.Menu(labelItem1, labelItem2, labelItem3, null);
        menu.alignItemsVerticallyWithPadding(30);
        menu.setPosition(selectGround.width / 2, selectGround.height / 2);
        selectGround.addChild(menu, 1);
        scene.layerPause(this);
    },

    //开始触摸事件处理函数 
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();  // 获取事件所绑定的 target
        var locationInNode = target.convertToNodeSpace(touch.getLocation());  //相对于target左下解的坐标（x,y）
        target.touchKey = target.containsTouchLocation(locationInNode);
        switch (target.touchKey) {
            case 1:
                target.zOrderSprite(target.bottomButton0_1,target.bottomButton1_1);
                target.showCombo(target.checkScore(target.getChildByTag(1)));
                break;
            case 2:
                target.zOrderSprite(target.bottomButton0_2,target.bottomButton1_2);
                target.showCombo(target.checkScore(target.getChildByTag(2)));
                break;
            case 3:
                target.zOrderSprite(target.bottomButton0_3,target.bottomButton1_3);
                target.showCombo(target.checkScore(target.getChildByTag(3)));
                break;
            case 4:
                target.zOrderSprite(target.bottomButton0_4,target.bottomButton1_4);
                target.showCombo(target.checkScore(target.getChildByTag(4)));
                break;
            default:
                break;
        }
        return true;
    },

    //移动触摸事件处理函数 
    onTouchMoved:function(touch, event){},

    //结束触摸事件处理函数
    onTouchEnded:function(touch, event){
        var target = event.getCurrentTarget();
        switch (target.touchKey) {
            case 1:
                target.zOrderSprite(target.bottomButton1_1,target.bottomButton0_1);
                break;
            case 2:
                target.zOrderSprite(target.bottomButton1_2,target.bottomButton0_2);
                break;
            case 3:
                target.zOrderSprite(target.bottomButton1_3,target.bottomButton0_3);
                break;
            case 4:
                target.zOrderSprite(target.bottomButton1_4,target.bottomButton0_4);
                break;
            default:
                break;
        }
    },

    //取消触摸事件处理函数 
    onTouchCancelled:function(touch, event){

    },

     onKeyPressed:function (key, event) {
        var target = event.getCurrentTarget();  // 获取事件所绑定的 target
        switch (key) {
            case 70:
                target.zOrderSprite(target.bottomButton0_1,target.bottomButton1_1);
                target.showCombo(target.checkScore(target.getChildByTag(1)));
                break;
            case 71:
                target.zOrderSprite(target.bottomButton0_2,target.bottomButton1_2);
                target.showCombo(target.checkScore(target.getChildByTag(2)));
                break;
            case 72:
                target.zOrderSprite(target.bottomButton0_3,target.bottomButton1_3);
                target.showCombo(target.checkScore(target.getChildByTag(3)));
                break;
            case 74:
                target.zOrderSprite(target.bottomButton0_4,target.bottomButton1_4);
                target.showCombo(target.checkScore(target.getChildByTag(4)));
                break;
            default:
                break;
        }
    },

     onKeyReleased:function (key, event) {
        var target = event.getCurrentTarget();
        switch (key) {
            case 70:
                target.zOrderSprite(target.bottomButton1_1,target.bottomButton0_1);
                break;
            case 71:
                target.zOrderSprite(target.bottomButton1_2,target.bottomButton0_2);
                break;
            case 72:
                target.zOrderSprite(target.bottomButton1_3,target.bottomButton0_3);
                break;
            case 74:
                target.zOrderSprite(target.bottomButton1_4,target.bottomButton0_4);
                break;
            default:
                break;
        }
    },

});

//创建一个新场景
var Game4KeyScene = cc.Scene.extend({   
    onEnter:function () {
        this._super();
        var layer = new game4KeyLayer(this.musicName, this.musicBeatMap, this.musicImage);
        this.addChild(layer, 1, 1);
    },
    layerPause:function(target){
        if (target != null) {
            target.pause();
            var children = target.getChildren();
            if (children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                         this.layerPause(children[i]);
                }
             }
            
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