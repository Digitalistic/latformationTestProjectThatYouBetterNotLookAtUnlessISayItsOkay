using UnityEngine;
using System.Collections;

public class Platformer : MonoBehaviour 
{
	public float walkSpeed;
	public float runSpeed;
	public float jumpSpeed;
	public float gravScale;

	//animation calls
	public Animator anim;

	//Animation List in Mechanim
	//horizontalVelocity - Used to change from idle to walk
	//verticalVelocity
	//onGround - Userd to change to falling state

	public bool toggleGUI = false;

	Vector2 myVelo;

	float xIn, yIn;

	bool isRunning = false;
	bool isGrounded = false;

	//made this bool public just because i don't know how you're going to use it
	public bool isFacingRight = true; //This is assuming we start facing right
	public Transform spriteTransform;

	GroundChekka feet;
	WallChekka[] wallChecks;

	public bool hasWallTop = false;
	public bool hasWallMid = false;
	public bool hasWallBot = false;
	public Transform startTop, startMid, startBot;
	public Transform endTop, endMid, endBot;

	public bool isFalling = false;

	public bool isGrabbingWall = false;

	public LayerMask wallGrabLayers;
	Vector2 faceDirection;
	public float grabDist;
	bool ableToGrabWall = true;

	// Use this for initialization
	void Start () 
	{
		//set the animator
		anim = GetComponent<Animator>();

		feet = GetComponentInChildren<GroundChekka>();
		wallChecks = GetComponentsInChildren<WallChekka>();

		//grabDistTop = Vector3.Distance(startTop.position, endTop.position) * 1.2f;
		//grabDistMid = Vector3.Distance(startMid.position, endMid.position) * 1.2f;

		rigidbody2D.gravityScale = gravScale;	//Gravity, starring Sandra Bullock, coming soon to DVD and Blu-Ray!
	}
	
	// Update is called once per frame
	void Update () 
	{
		//set the vertical and horizontal velocity
		anim.SetFloat("horizontalVelocity", Mathf.Abs( rigidbody2D.velocity.x));
		anim.SetFloat("verticalVelocity", rigidbody2D.velocity.y);
		anim.SetBool("onGround", isGrounded);

		if(Input.GetKeyDown(KeyCode.Escape)) {

			toggleGUI = !toggleGUI;

		}

		if(!isGrabbingWall)
			ProcessMovement();
		else
			ProcessWallGrabInput();
	}

	void ProcessMovement()
	{
		myVelo = rigidbody2D.velocity;	//get the current velocity. we're going to mess with this!
		
		xIn = Input.GetAxis("Horizontal");
		yIn = Input.GetAxis("Vertical");

		yIn = yIn + 0;	//This line only exists so I can have 0 warnings.
		
		if(isRunning)	//if we're running, use run speed, and check for button release
		{
			myVelo.x = xIn * runSpeed;

			if(Input.GetButtonUp("Run"))
				EndRunning();
		}
		else   //if we're walking, use walk speed and check for run button press
		{
			myVelo.x = xIn * walkSpeed;
			
			if(Input.GetButtonDown("Run"))
				BeginRunning();
		}

		if(isGrounded)
		{
			if(Input.GetButtonDown("Jump"))
			{
				Jump();
			}
		}

		if(isFacingRight)
		{
			if(myVelo.x < 0)
				FlipHorizontal();
		}
		else
		{
			if(myVelo.x > 0)
				FlipHorizontal();
		}

		if(!isFalling)
		{
			if(myVelo.y < 0)
				SwitchFallingStatus();
		}
		else
		{
			if(myVelo.y >= 0)
				SwitchFallingStatus();
		}

		if(Mathf.Abs(myVelo.y) > jumpSpeed)	//limit y-axis speed for constant falling
		{
			if(myVelo.y > 0)
				myVelo.y = jumpSpeed;
			else
				myVelo.y = -jumpSpeed;
		}

		rigidbody2D.velocity = myVelo;	//apply our given velocity

		DetectWallGrab();
	}

	void DetectWallGrab()	//use raycasts to determine if we should grab a wall
	{
		if(ableToGrabWall)
		{
			if(isFacingRight)
				faceDirection = Vector2.right;
			else
				faceDirection = -Vector2.right;

			if(Physics2D.Raycast(startTop.position, faceDirection, grabDist, wallGrabLayers))
				hasWallTop = true;
			else
				hasWallTop = false;

			if(Physics2D.Raycast(startMid.position, faceDirection, grabDist, wallGrabLayers))
				hasWallMid = true;
			else
				hasWallMid = false;

			if(Physics2D.Raycast(startBot.position, faceDirection, grabDist, wallGrabLayers))
				hasWallBot = true;
			else
				hasWallBot = false;

			if(!hasWallTop)
			{
				if(hasWallMid && hasWallBot)
				{
					if(isFalling)
					{
						GrabWall();
					}
				}
			}
		}
	}

	void ProcessWallGrabInput()
	{
		if(Input.GetButtonDown("Jump"))
		{
			DetachWall();
		}
	}

	void FlipHorizontal()
	{
		feet.ClearCollisionList();

		foreach(WallChekka wc in wallChecks)
			wc.ClearCollisionList();

		isFacingRight = !isFacingRight;
		Vector3 scale = spriteTransform.localScale;
		scale.x *= -1;
		spriteTransform.localScale = scale;
	}

	void SwitchFallingStatus()
	{
		isFalling = !isFalling;
	}

	void Jump()	//Jump around. Jump around. Jump up, jump up and get down!
	{
		myVelo.y = jumpSpeed;
	}

	//These two are seperate functions in case you want something to happen like a speed effect or whatever
	void BeginRunning()
	{
		isRunning = true;
	}

	void EndRunning()
	{
		isRunning = false;
	}

	//These two are seperate functions in case you want something to happen like dust particles or whatever
	public void LandOnFloor()
	{
		Debug.Log("On Floor");
		isGrounded = true;
	}

	public void LeaveFloor()
	{
		Debug.Log("Floor Departed");
		isGrounded = false;
	}

	void GrabWall() //This just stops the player in place. I may need to have something that moves them "into" a proper grab position
	{
		if(!isGrabbingWall)
		{
			EndRunning();

			rigidbody2D.isKinematic = true;
			rigidbody2D.Sleep();
			rigidbody2D.velocity = Vector3.zero;
			isGrabbingWall = true;

			Debug.Log("On the wall");
		}
	}

	void DetachWall()
	{
		if(isGrabbingWall)
		{
			//xIn = Input.GetAxis("Horizontal");
			yIn = Input.GetAxis("Vertical");
			myVelo = rigidbody2D.velocity;

			if(yIn <= -0.2f)
				myVelo.y = 0;
			else
				myVelo.y = jumpSpeed / 1.2f;

			rigidbody2D.isKinematic = false;
			rigidbody2D.WakeUp();
			isGrabbingWall = false;
			DisableWallGrab();
			Invoke("EnableWallGrab", 0.2f);

			if(Input.GetButton("Run"))
				BeginRunning();

			rigidbody2D.velocity = myVelo;

			Debug.Log("No more wall grab!");
		}
	}

	void EnableWallGrab()	{	ableToGrabWall = true;	}
	void DisableWallGrab()	{	ableToGrabWall = false;	}

	//These are used in checking if we can grab a ledge
	/*public void DetectWallTop()	{	hasWallTop = true;	UpdateWallStatus();	}
	public void DetectWallMid()	{	hasWallMid = true;	UpdateWallStatus();	}
	public void DetectWallBot()	{	hasWallBot = true;	UpdateWallStatus();	}

	public void RemoveWallTop()	{	hasWallTop = false;	UpdateWallStatus();	}
	public void RemoveWallMid()	{	hasWallMid = false;	UpdateWallStatus();	}
	public void RemoveWallBot()	{	hasWallBot = false;	UpdateWallStatus();	}

	void UpdateWallStatus()
	{
		if(!isGrabbingWall)
		{
			if(!hasWallTop)
			{
				if(hasWallMid && hasWallBot)
				{
					//we're at the "top" of a wall. grab ledge if falling
					if(isFalling && !isGrounded)
					{
						GrabWall();
					}
				}
			}
		}
		else
		{
			if(hasWallTop)
			{
				DetachWall();
			}
		}
	}*/

	void OnGUI() {

		GUILayout.BeginArea(new Rect(0,0, Screen.width, Screen.height));
		GUILayout.Label("Press Escape for Options");

		if(toggleGUI)
		{

			GUILayout.Label("Walk Speed: " + walkSpeed);
			walkSpeed = GUILayout.HorizontalSlider(walkSpeed, 0, 10);
			
			GUILayout.Label("Run Speed: " + runSpeed);
			runSpeed = GUILayout.HorizontalSlider(runSpeed, 0, 10);
			
			GUILayout.Label("Jump Speed: " + jumpSpeed);
			jumpSpeed = GUILayout.HorizontalSlider(jumpSpeed, 0, 10);
			
			GUILayout.Label("Gravity Scale: " + gravScale);
			gravScale = GUILayout.HorizontalSlider(gravScale, 0, 10);

		}

		GUILayout.EndArea();

	}
}
