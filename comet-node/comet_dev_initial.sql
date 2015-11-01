-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2015 at 07:44 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `comet_dev`
--
CREATE DATABASE IF NOT EXISTS `comet_dev` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `comet_dev`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getActiveTickets`()
    READS SQL DATA
SELECT id, status, created_at, updated_at, companyname, indicator_tag, indicator_model, indicator_manu 
FROM tickets 
ORDER BY id ASC, created_at ASC, companyname ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getTickets`()
    READS SQL DATA
SELECT id, status, created_at, updated_at, companyname, indicator_tag, indicator_model, indicator_manu 
FROM tickets 
WHERE status = 'Pending' OR status = 'Diagnosed' OR status = 'Repaired' OR status = 'Waiting for Parts' OR status = 'Waiting for Customer' 
ORDER BY id ASC, created_at ASC, companyname ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getUsers`()
    READS SQL DATA
SELECT id, username, firstName, lastName, email 
FROM users 
ORDER BY username ASC, firstName ASC, lastName ASC$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
`id` int(10) NOT NULL,
  `ticket_id` int(10) NOT NULL,
  `status` varchar(40) NOT NULL,
  `timespent` int(4) DEFAULT '0',
  `comments` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(10) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(6) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `ticket_id`, `status`, `timespent`, `comments`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 10, 'Pending', 0, 'The scale won''t calibrate.', '2015-05-26 21:00:00', 3, NULL, 0),
(2, 11, 'Pending', 0, 'The scale won''t hold calibration', '2015-05-26 21:00:00', 3, NULL, 0),
(3, 12, 'Pending', 0, 'The scale will not power up.', '2015-05-26 21:00:00', 3, NULL, 0),
(4, 13, 'Pending', 0, 'The scale needs a new power cord.', '2015-05-26 21:00:00', 3, NULL, 0),
(5, 14, 'Pending', 0, 'The scale will not power up.', '2015-05-26 21:00:00', 3, NULL, 0),
(6, 15, 'Pending', 0, 'The scale has a bad power cord.', '2015-05-26 21:00:00', 3, NULL, 0),
(32, 15, 'Repaired', 0, 'Short in power cord. Replaced power cord. Tested scale. Scale functioning normally. Right on at 50 lb. Ready to return to customer.', '2015-06-02 11:12:46', 2, NULL, 0),
(33, 11, 'Diagnosed', 0, 'Customer tag says won''t tare. Our tag says won''t calibrate. Checked load cell. Load cell good. Disassembled the scale. Cleaned under the spider and load cell. Reassembled scale. Calibrated and tested. Scale accepts calibration and repeats weight. Tare function works fine. Spider missing one rubber foot. Does not seem to affect scale. No problem found. Scale ready to return to customer.', '2015-06-02 11:16:18', 2, NULL, 0),
(34, 13, 'Repaired', 0, 'Scale needed power cord. Nothing else wrong. Took power cord from another customer unit that won\\''t power on at all. Scale functions as it should. Ready to return to customer.', '2015-06-02 11:17:53', 2, NULL, 0),
(35, 12, 'Repaired', 0, 'Customer tag said won''t power on. Keypad responded to input. Opened indicator. Display connections had come loose. Repeated connections. Scale powers on and functions properly. Ready to return to customer.', '2015-06-02 11:19:45', 2, NULL, 0),
(36, 14, 'Diagnosed', 0, 'Scale will not power on. Good power coming in. No power anywhere else. Bad main board. Scale also needs power adapter.', '2015-06-02 17:16:39', 2, NULL, 0),
(37, 10, 'Diagnosed', 0, 'Scale will not calibrate. Scale is drifting bad. Load cell failed ohm test. Need to replace load cell.', '2015-06-02 17:18:32', 2, NULL, 0),
(38, 16, 'Pending', 0, 'Bobby brought this scale back to the shop for diagnosis. Customer noted that the display isn''t working as of 6/2/2015.', '2015-06-02 19:01:59', 1, NULL, 0),
(39, 16, 'Diagnosed', 0, 'Initially the scale would boot up and the display would show the test sequence normally but when it went to weigh mode nothing would display. Took the cover off of the indicator column and the weight display came back. With the zero button wired up the indicator would freak out after a minute and go crazy. Without the zero button the indicator has been steady with no issues. Will try soldering the zero button directly to see if it helps later on. Scale still needs further repair at this time.', '2015-06-02 20:05:12', 1, NULL, 0),
(40, 16, 'Repaired', 0, 'No display scale acting erratic. Zero button shorting out causing all of the issues. Hard soldered the zero leads to the board. Scale functioning normal. Tested at 50 lbs. Test ok. Scale ready to return to customer.', '2015-06-03 23:22:37', 2, NULL, 0),
(42, 16, 'Delivered', 0, 'Delivered the scale to Therma Tru. The scale was accepted by Tim Damron.', '2015-06-08 13:51:47', 1, NULL, 0),
(43, 17, 'Pending', 0, 'This scale was brought into the shop by the customer to have its annual calibration/certification performed.', '2015-06-08 14:12:25', 1, NULL, 0),
(45, 17, 'Additional Notes', 0, 'The scale is testing OK and testing within tolerance.  No issues found with the scale.', '2015-06-08 15:14:32', 1, NULL, 0),
(51, 20, 'Pending', 0, 'Per customer the scale does not work.', '2015-06-09 17:08:43', 1, NULL, 0),
(52, 20, 'Diagnosed', 0, 'The scale was initially drifting. Checked out the load cell with a GSE indicator and it was reading linear but at no load it was -3 mv. Hooked the load cell back up to the toledo indicator and tried calibration. The indicator is unable to compensate for the negative zero range. If 1kg is added to the scale it allows it to zero. After that it read linearly to capacity. Load cell has been damaged and will need to be replaced. \nLoad cell information:\nPN: 21203885\nSN: 6068591-6JE\nEMAX 22KG\nSafeload 33KG\nVMIN 2.0', '2015-06-09 18:25:34', 1, NULL, 0),
(54, 22, 'Pending', 0, 'CRANE SCALE.  ISO 9000 CALIBRATION - MINIMUM OF THREE WEIGHT DROPS.  CALL CUSTOMER WHEN COMPLETE FOR PICK-UP 471-6775.', '2015-06-10 19:46:05', 7, NULL, 0),
(55, 22, 'Diagnosed', 0, 'The battery is not putting out enough power to power on the indicator. I was able to power on the indicator with a different source. Recommend a replacement battery capable of the minimum 12V DC power output. The current battery has minimal amperage output and now only 10 V DC at full charge.', '2015-06-12 19:47:06', 1, NULL, 0),
(60, 27, 'Pending', 0, 'Per customer the scale is jumping and showing error 13. Justin brought the scale back to the shop and has a video of the issue.', '2015-06-15 10:52:09', 1, NULL, 0),
(61, 27, 'Additional Notes', 0, 'No issues so far at the shop. Have been unable to duplicate the issue.', '2015-06-15 11:52:46', 1, NULL, 0),
(64, 28, 'Pending', 0, 'The scale was brought back from Prezels by Dan and Chris and is marked as will not boot up blown load cell.', '2015-06-17 15:48:21', 1, NULL, 0),
(65, 10, 'Additional Notes', 0, 'The only identifying information left on the load cells is:\n003664\n60K-2\nThis is for a weigh tronix WI-125 as marked above.  The base also has no identifying information left intact.', '2015-05-26 21:00:02', 1, '2015-11-01 18:38:19', 0),
(67, 28, 'Diagnosed', 0, 'This scale is marked as having a bad load cell.  The load cell information is:\nDoran\nModel no. 1022\nThis is a 10lb scale.', '2015-06-17 16:00:00', 1, '2015-11-01 18:40:18', 0),
(68, 14, 'Waiting for Parts', 0, 'Ordered 6-17-151) FV-05C power adapter1) PZ:4340 mainboard', '2015-06-23 20:00:00', 7, '2015-11-01 18:39:17', 0),
(69, 28, 'Waiting for Parts', 0, '6-17-15 ordered  \n1) LCP22010 load cell', '2015-06-17 17:22:05', 7, NULL, 0),
(70, 20, 'Waiting for Parts', 0, '6-16-15\nordered 1) 62031509 load cell from Cech', '2015-06-17 17:41:50', 7, NULL, 0),
(71, 17, 'Delivered', 0, 'Customer picked up scale 6-8-15', '2015-06-17 18:05:33', 7, NULL, 0),
(72, 22, 'Repaired', 0, 'Dan bought and replaced the battery for this scale.  Sean removed the lockout password from the setup menu.  Tested and calibrated the scale.  The scale is now working correctly and testing within tolerance.', '2015-06-17 18:34:36', 1, NULL, 0),
(73, 13, 'Delivered', 0, 'Dan delivered scale on 6.17.15', '2015-06-17 18:53:38', 3, NULL, 0),
(74, 12, 'Delivered', 0, 'Scale delivered.', '2015-06-17 18:54:33', 3, NULL, 0),
(75, 10, 'Diagnosed', 0, '6-17-15 Load cell part number is 105-60K and is $685.  Checking with the customer to see if they want to repair or replace.', '2015-06-17 19:24:02', 7, NULL, 0),
(76, 11, 'Tested OK', 0, 'This scale is testing OK no problems found ready to return this scale to the customer.', '2015-06-17 21:13:24', 1, NULL, 0),
(77, 15, 'Delivered', 0, 'Delivered 6-17-15 by DG', '2015-06-18 15:01:04', 7, NULL, 0),
(80, 29, 'Pending', 0, 'The scale will not read weight.  Will not calibrate.  When the cable is moved around it flashes between underload and overload.  Brought the scale back to the shop for diagnosis and repair.', '2015-06-18 18:00:00', 1, '2015-11-01 18:39:58', 0),
(81, 28, 'Repaired', 0, 'Installed new loadcell. Calibrated scale and it is ready to be returned to Pretzels.', '2015-06-18 17:29:55', 5, NULL, 0),
(82, 30, 'Pending', 0, 'Initial diagnosis was that the scale would not power up.', '2015-06-18 17:17:40', 5, NULL, 0),
(83, 29, 'Diagnosed', 0, 'The scale has a bad mainboard.  The load cell is testing OK and has been verified with a different indicator.  The only board in this indicator is the mainboard.  Customer may also consider an indicator replacement.  I would recommend sending various quotes to the customer as far as replacement/repair.', '2015-06-18 18:19:59', 1, NULL, 0),
(84, 27, 'Tested OK', 0, 'Sean found that the main problem lies with removing the bin and pieces while the display shows updating.  This causes the APW to be lost and makes the scale appear to go crazy.  Once units is pressed it goes back to the main weigh screen with no issues.  The operator would then have to sample again since the sample would now be gone.', '2015-06-18 18:21:43', 1, NULL, 0),
(85, 30, 'Repaired', 0, 'Added a new power supply calibrated the scale and put it back together.  The scale is now working correctly and testing ok.', '2015-06-18 18:31:54', 5, NULL, 0),
(86, 20, 'Repaired', 0, 'Replaced load cell. Calibrated. Tested right on.', '2015-06-23 19:43:23', 4, NULL, 0),
(87, 14, 'Diagnosed', 0, 'Installed the new mainboard and used the new power adapter with the scale.  The new mainboard has been setup and the scale has been calibrated.  Unfortunately the existing power port is very gunked up with pretzels material so if the power adapter gets rotated or moved in the port the scale will power down.  Recommend replacing this port as well but there arent anymore of this indicator in the scale graveyard.', '2015-06-23 19:48:26', 1, NULL, 0),
(88, 11, 'Complete', 0, 'Please return to customer during PI on 6-24-15', '2015-06-23 20:11:22', 7, NULL, 0),
(89, 14, 'Repaired', 0, 'Complete.  Ready to return to customer 6-24-15', '2015-06-23 20:13:36', 7, NULL, 0),
(90, 10, 'Waiting for Customer', 0, 'Updating the status to Waiting for Customer since we are waiting for customer approval to order parts/repair the scale.', '2015-06-24 19:48:32', 1, NULL, 0),
(91, 28, 'Complete', 0, 'returned to customer by CC during PI on 6-24-15', '2015-06-25 13:33:10', 7, NULL, 0),
(92, 12, 'Delivered', 0, 'Returned to customer by CC during PI 6-24-15', '2015-06-25 13:34:12', 7, NULL, 0),
(93, 31, 'Pending', 0, 'Scale is reading Er CAL', '2015-06-25 17:57:11', 4, NULL, 0),
(94, 32, 'Pending', 0, 'Scale is reading overload at 5 lbs.', '2015-06-25 18:08:43', 4, NULL, 0),
(95, 33, 'Pending', 0, 'GRS-uL', '2015-06-25 18:13:36', 4, NULL, 0),
(97, 33, 'Diagnosed', 0, 'The scale would not calibrate or display weight.  Tested the load cell and it fails the Ohm test as well as not having any signal output from the cell.  OL on the Ex+ side.  The load cell is a 10lb Doran Model 1022 load cell for a Doran DXL7010/88 scale base with a Doran 2200 CW indicator.  The scale needs a new load cell.', '2015-06-25 19:52:17', 1, NULL, 0),
(99, 33, 'Additional Notes', 25, 'Spent 25 minutes on the initial scale diagnosis.', '2015-06-25 19:53:53', 1, NULL, 0),
(103, 32, 'Repaired', 60, 'Upon inspection the scale was reading overload/underload all of the time would not read weight at all.  Disassembled the scale and made adjustments.  The load cell tested OK no problems found.  Reassembled the scale and calibrated.  The scale is now reading right on and testing OK.  One hour spent on the scale repair.', '2015-06-25 19:10:00', 1, '2015-11-01 18:41:11', 0),
(104, 31, 'Tested OK', 0, 'The scale did read ErrCal on startup but after calibration the scale is working correctly.  The scale is testing OK.  Spent approximately 5 minutes on this scale.', '2015-06-26 17:27:26', 1, NULL, 0),
(105, 36, 'Pending', 0, 'Replaced main board. No more drifting problem. Letting it cook over weekend. 6/26/15', '2015-06-26 18:50:57', 4, NULL, 0),
(113, 14, 'Additional Notes', 0, 'This scale is currently at the shop.  Possibly pending additional repair since the power port is touchy even with the new power supply.', '2015-06-23 21:00:00', 1, '2015-11-01 18:39:45', 0),
(118, 27, 'Delivered', 0, 'Justin returned this scale at some point.', '2015-06-29 19:52:59', 1, NULL, 0),
(119, 36, 'Additional Notes', 0, 'Still drifting with the new mainboard.  Needs further testing / troubleshooting.', '2015-06-29 20:07:59', 1, NULL, 0),
(120, 20, 'Delivered', 0, 'The scale was delivered to the customer today by Chris.', '2015-06-29 20:09:17', 1, NULL, 0),
(121, 38, 'Pending', 0, 'This was a new scale. Now has a bad load cell. Brought back to the shop for warranty replacement / repair from sartorius.', '2015-07-01 00:37:10', 1, NULL, 0),
(122, 39, 'Pending', 0, 'This scale has been at the shop for quite some time.  Likely at least 6 months.  Adding this scale to the inshop system for records.', '2015-07-02 00:07:32', 1, NULL, 0),
(123, 39, 'Diagnosed', 5, 'The indicator has a bad mainboard and is displayed Loc\\'' Up.  The indicator would need a new mainboard to repair the scale.', '2015-07-01 18:08:12', 1, NULL, 0),
(124, 40, 'Pending', 0, 'This scale has been in the shop for quite some time.  Adding the scale for record purposes.', '2015-07-02 00:13:54', 1, NULL, 0),
(125, 40, 'Diagnosed', 5, 'This scale is testing OK.  Per Dan we need to add a column to this scale so the indicator is mounted.  We will need to look into coming up with a mounting solution.', '2015-07-01 18:14:45', 1, NULL, 0),
(126, 14, 'Delivered', 0, 'Delivered the scale to the customer on 6/30/15.', '2015-07-01 18:15:44', 3, NULL, 0),
(127, 31, 'Delivered', 0, 'Delivered the scale to the customer on 6/30/15', '2015-07-01 18:16:27', 3, NULL, 0),
(128, 32, 'Delivered', 0, 'Delivered the scale to the customer on 6/30/15.', '2015-07-01 18:16:49', 3, NULL, 0),
(129, 22, 'Delivered', 0, 'Delivered to the customer by Bobby on 6/25/15.', '2015-07-01 18:19:12', 1, NULL, 0),
(131, 41, 'Pending', 0, 'THE MANUAL STATES THAT ERROR5 MEANS THAT THE BALANCE DETECTS AN UNEXPECTED LOAD.  THE LOAD CELL IS SHOWING DC VOLTAGE INSTEAD OF MV ON THE SIGNAL OUTPUT.  BAD LOAD CELL.  THE MAINBOARD APPEARS TO BE WORKING OK HOWEVER THE POWER PORT IS TOUCHY DUE TO ALL OF THE BUILDUP IN THE PORT.  THIS SCALE NEEDS A NEW LOAD CELL.', '2015-07-02 01:57:51', 7, NULL, 0),
(132, 41, 'Diagnosed', 10, 'The scale has a bad load cell.  Needs a new load cell.', '2015-07-01 20:01:21', 1, NULL, 0),
(133, 42, 'Pending', 0, 'The scale was shipped to the shop by the customer. They have the scale marked as will not power up.', '2015-07-02 02:01:44', 1, NULL, 0),
(135, 42, 'Diagnosed', 10, 'This scale will not power on and does not appear to be getting voltage through the mainboard. Probable bad main board. Unable to get good load cell readings so I was unable to determine the health of the cell. This scale needs a new mainboard', '2015-07-01 20:03:14', 1, NULL, 0),
(136, 42, 'Repaired', 15, 'Found an old tyson scale in the graveyard that had a good mainboard and bad cell. Put the good mainboard into this scale and calibrated. The scale is now reading right on and testing OK. The scale has been repaired.', '2015-07-01 20:03:52', 1, NULL, 0),
(138, 33, 'Additional Notes', 0, 'Justin Konopacki quoted June Bowers for new load cell.', '2015-07-02 14:06:19', 10, NULL, 0),
(139, 33, 'Additional Notes', 0, 'Waiting for customer', '2015-07-02 14:07:19', 10, NULL, 0),
(140, 42, 'Additional Notes', 0, 'Sent quote', '2015-07-02 20:27:06', 10, NULL, 0),
(142, 33, 'Diagnosed', 0, 'Received PO#4700120707.  Proceed with repair.\\r\\nQuote #7115-JK-4613', '2015-07-06 17:27:23', 7, NULL, 0),
(143, 43, 'Pending', 0, 'Keypad water damage.', '2015-07-10 01:55:30', 4, NULL, 0),
(144, 44, 'Pending', 0, 'Drifting', '2015-07-10 01:57:01', 4, NULL, 0),
(145, 45, 'Pending', 0, 'Weigh bars are weighing right on to 500 lb some drift can be introduced via the small slit in the cable where the weigh bars connect to the indicator. Power port pin is tight however power clamp is worn and not retaining shape resulting in very inconsistent connection. Proposed repair cut damaged part of homerun connection at indicator which would in turn shorten cable &amp; wire power supply directly to indicator\\''s power receptacle. Could replace indicator with a T103SB would work as well .', '2015-07-13 12:43:06', 3, '2015-11-01 18:29:56', 0),
(146, 45, 'Additional Notes', 40, 'Time Added.', '2015-07-14 20:43:33', 3, '2015-11-01 18:30:22', 0),
(147, 10, 'Waiting for Parts', 0, 'Ordered new load cell', '2015-07-14 13:45:24', 10, NULL, 0),
(148, 29, 'Replaced the Scale', 0, 'We are replacing this scale with an Ohaus RC31P30 Counting scale', '2015-07-14 13:47:06', 10, NULL, 0),
(149, 39, 'Waiting for Parts', 0, 'Ordered new Mainboard', '2015-07-14 13:49:29', 10, NULL, 0),
(150, 40, 'Waiting for Parts', 0, 'Ordered B TEK 24\\&quot; column.', '2015-07-14 13:50:10', 10, NULL, 0),
(151, 41, 'Waiting for Customer', 0, 'Quoted new scale', '2015-07-14 13:51:27', 10, NULL, 0),
(152, 42, 'Repaired', 0, 'To be shipped today', '2015-07-14 13:52:36', 10, NULL, 0),
(153, 30, 'Diagnosed', 0, 'To be shipped today', '2015-07-14 13:54:36', 10, NULL, 0),
(154, 30, 'Repaired', 0, 'na', '2015-07-14 15:00:00', 10, '2015-11-01 18:40:41', 0),
(155, 33, 'Waiting for Parts', 0, 'na', '2015-07-06 19:00:00', 10, '2015-11-01 18:41:30', 0),
(156, 45, 'Repaired', 50, 'Replaced indicator with T103SB after customer approval moved over homerun cable connection to indicator to T103SB. Setup and calibrated; tested right on.', '2015-07-14 19:48:19', 3, NULL, 0),
(157, 46, 'Pending', 0, 'Brought scale back from customer\\''s location heating element not engaging to send to Sartorious for repairs.', '2015-07-15 01:49:57', 3, NULL, 0),
(158, 30, 'Delivered', 0, 'Delivered back to customer', '2015-07-15 12:32:39', 10, NULL, 0),
(159, 42, 'Delivered', 0, 'na', '2015-07-15 12:33:27', 10, NULL, 0),
(160, 39, 'Repaired', 60, 'Replaced head with one from the graveyard that had a bad mainboard and was in better condition with a working setup button. Installed new mainboard into it. The new board is a different stylr and you can barely read its display. Set it up and calibrated it and it is reading right on. Not enough time to see if a backlight adjustment was even possible. Will need to be looked into further.', '2015-07-23 19:48:31', 1, NULL, 0),
(161, 47, 'Pending', 0, 'Mark brought this scale back to the shop for repair.  No information listed as to what is wrong with it.', '2015-07-24 20:55:56', 1, NULL, 0),
(162, 47, 'Diagnosed', 15, 'The ribbon cable connecting the zero/off/on button to the mainboard is torn slightly but it seems to be working ok.  The indicator is reading weight and the scale is testing within tolerance.  Every once in a while the scale would read under zero.  Adjusted the zero POT and will let the scale sit to see if there is anymore issues.', '2015-07-24 14:58:01', 1, NULL, 0),
(163, 48, 'Pending', 0, 'Dan and Barry brought this scale back to the shop for repair. The scale came back with a broken power supply and would not power on.', '2015-07-24 21:30:13', 1, NULL, 0),
(164, 48, 'Diagnosed', 20, 'Tried a few different power supplies but I was able to get it to power on with a 13.5vDC 300mA power supply.  The broken one that was with it was 12vDC 300mA.  Tested the scale with weight and it read right on from 5lb all the way up to 60lb.  No further issues found with the scale recommend using either the power supply I used for testing or ordering in a new one for this scale.', '2015-07-24 15:31:42', 1, NULL, 0),
(165, 36, 'Delivered', 0, 'Bobby took this scale back to Kenna Metal and it is said to be working. Removing from Pending status.', '2015-07-24 15:38:54', 1, NULL, 0),
(166, 38, 'Delivered', 0, 'The warranty replacement scale came in and has been installed and calibrated on location.', '2015-07-24 15:39:32', 1, NULL, 0),
(167, 49, 'Pending', 0, 'Unsure of scale capacity and divisions put in placeholder numbers.  Dan and Barry brought this scale back to the shop for repair.  The load cell cable going to the indicator is cut and the base is disassembled.  Diagnosis will be required.', '2015-07-24 21:44:14', 1, NULL, 0),
(168, 49, 'Diagnosed', 45, 'Cleaned the cart and the scale base.  The base would be re-usable but the load cell has had its cable cut.  Load cell would have to be replaced.  The indicator for this scale will not power up with good AC power.  Recommend indicator replacement.  The cart is in OK shape.  With a new load cell and an indicator the scale could be working again.', '2015-07-24 17:11:53', 1, NULL, 0),
(169, 44, 'Diagnosed', 60, 'Initially the scale was drifting as Chris noted.  Checking bolts were not an issue.  Took load cell cable out of the indicator and Ohm\\''d the cell.  Initially excitation appeared to be erratic but by the end of the testing the cell was testing somewhat normally but the Exc+ to Sig+ / Sig- and Exc- to Sig+ / Sig- readings are 30 ohms apart.  Upon hooking the load cell back up the display showed 42 lb on the scale.  Zero\\''d the scale and it was no longer drifting and is testing within tolerance.  The scale is also missing 2 feet.  Leaving my simulator on the scale just to make sure the indicator doesn\\''t have an underlying issue as well.\\r\\n\\r\\nRecommend: 1x Load cell 2x Feet', '2015-07-24 18:13:58', 1, NULL, 0),
(170, 43, 'Diagnosed', 20, 'Keypad is bad and the mainboard is blown. AC power terminal was blown off of the mainboard and its scortched. Will obviously not power on. Recommend indicator replacement.', '2015-07-24 20:02:43', 1, NULL, 0),
(171, 44, 'Waiting for Customer', 0, 'Quoted new scale and new load cell.', '2015-07-28 19:15:28', 10, NULL, 0),
(172, 43, 'Waiting for Customer', 0, 'Quoted new indicator.', '2015-07-28 19:16:01', 10, NULL, 0),
(173, 48, 'Waiting for Customer', 0, 'Sent quote for new power supply', '2015-07-24 18:31:42', 10, '2015-11-01 18:42:20', 0),
(174, 49, 'Waiting for Customer', 0, 'Sent quote for new scale and indicator.', '2015-07-24 18:11:53', 10, '2015-11-01 18:42:32', 0),
(175, 40, 'Repaired', 60, 'Added column to the scalr and shimmed the load cell so the pan didnt touch. Calibrates the scale.  The scale is now testing ok and testing within tolerance. Scale ready to be returned.', '2015-07-29 20:04:14', 1, NULL, 0),
(177, 46, 'Additional Notes', 0, 'Amy shipped the scale to Sartorius for Warranty.', '2015-07-30 19:58:39', 1, NULL, 0),
(178, 47, 'Additional Notes', 0, 'After almost a week the scale is still working fine.  The scale has been sitting on the workbench powered on and is weight without any issues.', '2015-07-30 20:01:04', 1, NULL, 0),
(179, 50, 'Pending', 0, 'Mainboard failing moving application over to a GSE 665 and testing.', '2015-07-31 17:27:33', 3, NULL, 0),
(180, 51, 'Pending', 0, 'Remote Display Requires New RS-232 Communication Chip. To Install Spare In Shop and Leave On Indicator To Test.', '2015-08-06 18:40:41', 8, NULL, 0),
(181, 43, 'Diagnosed', 0, 'Ordered replacement GSE-465 (200465-00000) on our PO #15-9209', '2015-08-07 18:02:51', 7, NULL, 0),
(182, 44, 'Diagnosed', 0, 'Ordered replacement D25WR Ohaus Defender SS Bench Scale (Base Only) on our PO #15-9210.', '2015-08-07 18:10:26', 7, NULL, 0),
(184, 43, 'Repaired', 30, 'Replaced the bad indicator with the indicator from S25.  Tested and calibrated the scale.  The scale is now testing OK and reading right on.  The scale could still use the rubber pan supports under the pan ( 4 of them ).  The scale is otherwise OK.', '2015-08-12 19:03:59', 1, NULL, 0),
(187, 44, 'Diagnosed', 45, 'Replaced old scale with a new scale and indicator. New scale is set up and calibrated.', '2015-08-12 19:20:42', 1, NULL, 0),
(188, 44, 'Repaired', 0, 'Changing status from diagnosed to repaired since the previous update should have been a repaired status.', '2015-08-12 19:25:26', 1, NULL, 0),
(189, 52, 'Pending', 0, 'Scale will not calibrate print button not working.', '2015-08-13 17:47:13', 3, NULL, 0),
(190, 48, 'Delivered', 0, 'Justin delivered scale 8-12-15', '2015-08-13 18:27:31', 7, NULL, 0),
(191, 40, 'Delivered', 0, 'Justin delivered this scale 8-12-15', '2015-08-13 18:29:04', 7, NULL, 0),
(192, 43, 'Delivered', 0, 'Justin delivered scale to customer 8/12/15', '2015-08-14 13:35:55', 7, NULL, 0),
(193, 43, 'Complete', 0, '-', '2015-08-14 13:36:20', 7, NULL, 0),
(194, 44, 'Delivered', 0, 'Justin delivered scale to customer 8/12/15', '2015-08-14 13:36:54', 7, NULL, 0),
(195, 44, 'Complete', 0, '-', '2015-08-14 13:37:01', 7, NULL, 0),
(196, 52, 'Repaired', 35, 'The plastic piece that actuates the push button on the board was broken off.  Used PVC cement to reattach it and it seems to be working OK.  One of the rubber pieces on the spider that holds the pan in place is missing.  It looks like the screen has been glued into place previously.  This scale is really showing its age.  The scale is testing OK for now.', '2015-08-14 18:04:51', 1, NULL, 0),
(197, 51, 'Repaired', 0, 'Matko display still seems to be working great.  Likely that this can be returned to the customer whenever possible.  Sean replacing the rs232 chip seems to have done the trick.', '2015-08-14 19:21:39', 1, NULL, 0),
(198, 41, 'Replaced the Scale', 0, 'The customer replaced this scale with a new one.  Placing this scale into the scale graveyard since the customer is not going to repair it.', '2015-08-14 19:36:58', 1, NULL, 0),
(199, 53, 'Pending', 0, 'Justin received this scale by someone who dropped it off to the shop.  Unknown as to what is supposed to be wrong with the scale.  The scale powers on and tests within tolerance up to capacity.  Awaiting further information from the customer and letting scale cook on the workbench.', '2015-08-15 01:45:17', 1, NULL, 0),
(200, 39, 'Delivered', 0, 'na', '2015-08-19 13:06:27', 10, NULL, 0),
(201, 54, 'Pending', 0, 'Customer reports that the scale will not stay at zero.  They shipped the scale to the shop for troubleshooting/repair.', '2015-08-25 01:38:33', 1, NULL, 0),
(202, 55, 'Pending', 0, 'Customer reports that the scale will not zero.  Customer shipped the scale to the shop for troubleshooting/repair.', '2015-08-25 01:40:08', 1, NULL, 0),
(204, 55, 'Repaired', 15, 'When I powered this scale on it went straight to zero.  No drifting and everything is testing OK.  Calibrated the scale and it is now repeating and reading within tolerance.  No problems found with this scale.', '2015-08-24 20:00:57', 1, NULL, 0),
(206, 54, 'Diagnosed', 35, 'Took scale apart and cleaned it out.  Tested and re-seated the load cell cable.  Load cell is testing OK and mainboard seems to be working correctly.  This scale was missing 3 feet so I took 3 from one of the other broken AND\\''s in the scale graveyard.  Leaving this scale powered on to see if it has any further issues with drifting away from zero.', '2015-08-24 20:01:19', 1, NULL, 0),
(207, 33, 'Additional Notes', 0, '8-25-15 Load cell part #1022 ordered on our PO #15-9246.', '2015-07-06 19:01:00', 7, '2015-11-01 18:41:45', 0),
(208, 39, 'Waiting for Parts', 0, 'Still scale was not delivered the mainboard was received but is broken. Still waiting for parts for this scale at this time.', '2015-08-27 11:36:39', 1, NULL, 0),
(209, 49, 'Waiting for Parts', 0, 'Ordered scale and indicator', '2015-08-27 11:51:51', 10, NULL, 0),
(210, 53, 'Delivered', 0, 'Gave to Jared.', '2015-08-27 11:55:31', 10, NULL, 0),
(211, 39, 'Waiting for Parts', 0, '8-27-15  Found board through different vendor.  Ordered on our PO#15-9252.', '2015-08-27 12:53:49', 7, NULL, 0),
(212, 52, 'Delivered', 0, '8-27-15 Justin delivering to customer.', '2015-08-27 12:55:04', 7, NULL, 0),
(213, 52, 'Complete', 0, '-', '2015-08-27 12:55:32', 7, NULL, 0),
(214, 54, 'Complete', 0, '8-27-15 Justin delivered to customer', '2015-08-27 12:55:59', 7, NULL, 0),
(215, 55, 'Delivered', 0, '8-27-15 Justin delivered to customer', '2015-08-27 12:57:06', 7, NULL, 0),
(216, 55, 'Complete', 0, '-', '2015-08-27 12:57:14', 7, NULL, 0),
(217, 10, 'Waiting for Customer', 0, 'Quoted June for a new base.', '2015-08-31 15:39:12', 10, NULL, 0),
(218, 10, 'Waiting for Parts', 0, '8-31-15\\r\\n\\r\\nORDERED REPLACEMENT BASE FROM BTEK ON OUR PO#15-9259\\r\\nCUSTOMER PO #4700120878.', '2015-08-31 18:05:14', 7, NULL, 0),
(219, 56, 'Pending', 0, 'Scale is marked as will not zero', '2015-09-01 01:14:10', 1, NULL, 0),
(220, 57, 'Pending', 0, 'Dan brought this scale back to the shop for the PI.  No marked issues with the scale.', '2015-09-01 01:15:09', 1, NULL, 0),
(221, 58, 'Pending', 0, 'Dan brought this scale back to the shop from the PI the scale is not marked with what is wrong with it.', '2015-09-01 01:16:23', 1, NULL, 0),
(222, 57, 'Diagnosed', 5, 'The scale has a bad load cell.  CG-22 5KG Dog bone style load cell.', '2015-08-31 19:19:48', 1, NULL, 0),
(224, 56, 'Diagnosed', 5, 'Upon powering on the scale it went straight to zero.  The scale is reading great at 50 and 100 lb.  No noticeable issues with the scale.  Letting the scale cook to see if any issues arise.', '2015-08-31 19:29:51', 1, NULL, 0),
(225, 58, 'Repaired', 10, 'Initially the scale would not power on.  The power connector inside the indicator had come loose.  Plugged it back in and the scale powered on.  The scale was reading linearly but was out of tolerance.  Calibrated the scale the scale is now reading right on and testing OK.', '2015-08-31 19:31:00', 1, NULL, 0),
(227, 59, 'Pending', 0, 'The scale is reading right on when tested with weight; however whenever the scale gets bumped or sudden weight is applied it will restart.', '2015-09-09 01:05:29', 1, NULL, 0),
(228, 59, 'Diagnosed', 35, 'Unable to completely isolate the issue but the primary cause seems to be the main display board rather than the main pcb.  Recommend further diagnosis but the issue seems to be pointing to the display board.', '2015-09-08 19:45:43', 1, NULL, 0),
(229, 57, 'Waiting for Parts', 0, '9-8-15\\r\\n\\r\\nORDERED CG-22 5KG LOAD CELL ON OUR PO #15-9275', '2015-09-08 20:15:58', 7, NULL, 0),
(230, 59, 'Additional Notes', 0, 'After further looking it appears there mayactually be an issue with one of the caps on the main board. Further work will be required.', '2015-09-09 11:52:42', 1, NULL, 0),
(231, 39, 'Repaired', 15, 'Set up and calibrated scale after new mainboard was installed. Scale is functioning properly. Ready to deliver to customer.', '2015-09-09 19:44:17', 2, NULL, 0),
(232, 60, 'Pending', 0, 'The scale is battery operated and the battery compartment is sealed because of the glue buildup.  Therma Tru wants us to see if we can remove it and get the scale back in working order.', '2015-09-12 16:02:32', 1, NULL, 0),
(233, 61, 'Pending', 0, 'Customer complaining of burned wire will not power on.', '2015-09-12 16:10:10', 1, NULL, 0),
(234, 62, 'Pending', 0, 'The scale seems like it has a loose loadcell cable connection in the mainboard.  Will require some disassembly for further diagnosis.', '2015-09-12 16:12:17', 1, NULL, 0),
(235, 63, 'Pending', 0, 'The scale does not power on.', '2015-09-12 16:13:01', 1, NULL, 0),
(236, 10, 'Additional Notes', 0, 'Base is in. Needs to be installed on Weigh Tronix Indicator and column', '2015-09-14 12:03:43', 10, NULL, 0),
(237, 33, 'Additional Notes', 0, 'Load cell has been replaced.  Still needs calibrated and Inspection report', '2015-09-14 12:04:53', 10, NULL, 0),
(238, 49, 'Additional Notes', 0, 'Ready for delivery', '2015-09-14 12:06:03', 10, NULL, 0),
(239, 56, 'Additional Notes', 0, 'Needs settings set to allow for the ability to \\&quot;0\\&quot; out .', '2015-09-14 12:07:13', 10, NULL, 0),
(240, 57, 'Additional Notes', 0, 'Load cell in in and needs installed calibrated and inspection report', '2015-09-14 12:08:06', 10, NULL, 0),
(241, 58, 'Additional Notes', 0, 'Ready for return', '2015-09-14 12:08:45', 10, NULL, 0),
(242, 61, 'Repaired', 90, 'Chris did the following repairs: Diagnosed scale. Resoldered on the power supply. Replaced fuse. Tested scsle. The scale is now testing OK.', '2015-09-14 18:44:30', 1, NULL, 0),
(243, 64, 'Pending', 0, 'Scale is marked as reading light. I observed a drift initially as well.', '2015-09-15 01:54:08', 1, NULL, 0),
(244, 64, 'Repaired', 15, 'Disassembled the scale and blew the out. Tightened scale components. Calibrated. The scale is now reading right on and working correctly.', '2015-09-14 19:55:17', 1, NULL, 0),
(245, 65, 'Pending', 0, 'The scale is marked as won\\''t stay at zero. Initially a substantial drift was observed.', '2015-09-15 01:57:18', 1, NULL, 0),
(246, 65, 'Repaired', 20, 'Disasdesembled the scale and blew out the dust. Secunectionnections and tightened scale components. calibrated the scale. The scale is now testing within tolerance. A minor slow drift can still be observed but load cell replacement would be required for further correction.', '2015-09-14 20:00:42', 1, NULL, 0),
(247, 66, 'Pending', 0, 'The scale is marked as showing error 5', '2015-09-15 02:02:23', 1, NULL, 0),
(248, 66, 'Diagnosed', 15, 'The scale has a bad load cell. Recommend either scale or load cell replacement.', '2015-09-14 20:02:52', 1, NULL, 0),
(250, 67, 'Pending', 0, 'Customer reports that the scale gets on a rebooting kick every once in a while where it will fail to start up repeatedly and keep beeping.  I have a feeling it may be the PSU they were using on site.  Leaving it powered up in the shop to see if any issues occur.', '2015-09-16 23:09:43', 1, NULL, 0),
(251, 46, 'Delivered', 0, 'MM Delivered 9-2-15', '2015-09-16 17:14:24', 7, NULL, 0),
(252, 49, 'Repaired', 0, '-', '2015-09-16 17:15:14', 7, NULL, 0),
(253, 61, 'Delivered', 0, 'MM delivered to customer 9-15-15', '2015-09-16 17:17:09', 7, NULL, 0),
(254, 10, 'Diagnosed', 15, 'New base came in but the old column does not match up to this base.  Nothing on hand to act as a substitute.  Recommend ordering column compatible with both the base and the WI-125 Indicator.', '2015-09-16 18:04:52', 1, NULL, 0),
(255, 68, 'Pending', 0, 'Scale is not repeating weights.', '2015-09-17 01:05:26', 4, NULL, 0),
(256, 58, 'Additional Notes', 45, 'Removed old wobbly column and replaced it with the one from scale #22 since it got a new base and its column wouldn\\''t work with it.  Calibrated the scale.  The scale is now reading right on and testing ok.', '2015-09-16 19:12:01', 1, NULL, 0),
(257, 33, 'Repaired', 0, 'Changing the status to repaired to reflect an accurate status.', '2015-09-22 11:58:57', 1, NULL, 0),
(258, 69, 'Pending', 0, 'Scale not powering on correctly and locking up', '2015-09-24 17:53:24', 3, NULL, 0),
(259, 47, 'Repaired', 45, 'Tried to swap to a different mainboard but could not get the solder to grab to the spot on the mainboard.  Using old mainboard in a different enclosure.  Dialed in the scale and it is now reading right on.  The scale is testing OK.', '2015-09-24 18:57:05', 1, NULL, 0),
(260, 70, 'Pending', 0, 'Scale mailed to us by Tyson. Problem ticket said \\&quot;scale not zeroing out\\&quot;. None of keypad functions working. Took scale apart. Unplugged and reconnected key pad. Key pad functions normally. Scale ready to return to customer.', '2015-09-25 01:04:00', 2, NULL, 0),
(261, 70, 'Repaired', 30, 'Scale ready to return to customer.', '2015-09-24 19:05:34', 2, NULL, 0),
(262, 69, 'Diagnosed', 30, 'There is a bad AC to DC transformer in this scale.  It has almost no DC output.  There is only enough to light the screen up but not provide any meaningful voltage to the scale.  Not sure what the expected DC output voltage is.  The only markings on the transformer are: XFR-001 827830.  If transformer replacement is not available recommend scale replacement.', '2015-09-24 19:29:02', 1, NULL, 0),
(263, 10, 'Repaired', 30, 'Barry created and added a column to this scale.  The scale is now setup and calibrated and working correctly.', '2015-09-29 11:49:24', 1, NULL, 0),
(264, 57, 'Additional Notes', 0, 'Where is the load cell?  This scale is not yet repaired no load cell to be found.', '2015-09-29 12:03:26', 1, NULL, 0),
(265, 71, 'Pending', 0, 'Scale not powering on. Missing battery pack.', '2015-09-30 02:23:51', 3, NULL, 0),
(266, 72, 'Pending', 0, 'Does not power on.', '2015-09-30 02:24:38', 3, NULL, 0),
(267, 56, 'Delivered', 0, 'Delivered the scale to the customer', '2015-09-29 20:25:51', 3, NULL, 0),
(268, 39, 'Delivered', 0, 'Delivered the scale to the customer.', '2015-09-29 20:26:34', 3, NULL, 0),
(269, 33, 'Delivered', 0, 'Delivered the scale to the customer', '2015-09-29 20:26:51', 3, NULL, 0),
(270, 58, 'Delivered', 0, 'Delivered the scale to the customer.', '2015-09-29 20:27:43', 3, NULL, 0),
(271, 10, 'Delivered', 0, 'Delivered the scale to the customer', '2015-09-29 20:27:56', 3, NULL, 0),
(272, 49, 'Replaced the Scale', 0, 'This scale was replaced by a BTEK and T103SB.  The new scale number is #133', '2015-09-29 20:28:55', 1, NULL, 0),
(273, 57, 'Repaired', 0, 'Ready to be returned.', '2015-10-01 19:41:57', 7, '2015-11-01 18:42:56', 0),
(274, 59, 'Delivered', 0, 'Returned during PI 9-29-15', '2015-09-29 14:08:45', 7, '2015-11-01 18:43:26', 0),
(276, 69, 'Additional Notes', 50, 'Shits broken get a new one', '2015-09-30 19:22:29', 3, NULL, 0),
(277, 69, 'Additional Notes', 0, 'On a serious note transformer is not providing stable voltage looked for another similar dual output transformer could not find one that would provide the two voltages needed. Recommend product replacement 50lb x 0.005.', '2015-09-30 19:23:50', 3, NULL, 0),
(278, 72, 'Repaired', 35, 'The mainboard was bouncing around inside the indicator since it was no longer secured.  All of the screws were present inside of the indicator.  Mounted the mainboard and found a bad fuse.  Replaced the bad fuse with a GSE fuse.  The scale is now powering on and reading right on.  The scale is testing ok and ready to be returned.', '2015-09-30 19:32:07', 1, NULL, 0),
(279, 57, 'Waiting for Parts', 0, 'No cell found at this time.  The scale is not yet repaired or ready for return.', '2015-09-30 19:41:57', 1, NULL, 0),
(280, 71, 'Diagnosed', 30, 'Repaired the stand and tested the scale with an inshop power supply.  This scale is missing its battery pack and power supply.  The scale is now testing OK and reading right on with weight.  A new power supply needs to be ordered for this scale and then it will be ready to be returned.', '2015-09-30 19:46:13', 5, NULL, 0),
(281, 73, 'Pending', 0, 'Scale will not power on.', '2015-10-03 00:42:21', 2, NULL, 0),
(282, 73, 'Diagnosed', 30, 'Scale has bad keypad. Specifically the power button. Load cell screen and all other buttons on keypad work. Needs new keypad.', '2015-10-02 18:43:48', 2, NULL, 0),
(283, 73, 'Waiting for Parts', 0, '10-2-15\\r\\n\\r\\nOrdered 44-35-40658 keypad from GSE on our PO #15-9322', '2015-10-02 20:29:51', 7, NULL, 0),
(284, 74, 'Pending', 0, 'Scale not reading weight correctly. Will not calibrate.', '2015-10-06 18:05:47', 2, NULL, 0),
(285, 57, 'Additional Notes', 0, 'Cell is here.', '2015-10-07 13:46:30', 10, NULL, 0),
(286, 65, 'Waiting for Customer', 0, 'waiting for po to replace scale', '2015-10-07 13:49:47', 10, NULL, 0),
(287, 66, 'Waiting for Customer', 0, 'JK QUOTED NEW SCALE.', '2015-10-07 14:06:07', 7, NULL, 0),
(288, 68, 'Repaired', 0, 'Ready to be delivered to customer.', '2015-10-07 14:06:51', 7, NULL, 0),
(289, 75, 'Pending', 0, 'Sean B diagnosed bad keypad.  Ordered keypad - repair on site. Per Paula', '2015-10-07 20:42:24', 7, NULL, 0),
(290, 64, 'Delivered', 0, '10-7-15 Shipped back to the customer.', '2015-10-07 15:30:12', 7, NULL, 0),
(292, 70, 'Delivered', 0, '10-7-15 Shipped back to the customer', '2015-10-07 15:32:00', 7, NULL, 0),
(293, 47, 'Delivered', 0, 'MM Delivered to customer', '2015-10-07 15:47:47', 7, NULL, 0),
(295, 71, 'Diagnosed', 0, '10-7-15 Get a replacement power supply from customer parts stock and return to customer.', '2015-10-07 15:51:17', 7, NULL, 0),
(296, 76, 'Pending', 0, 'Upon arrival the scale would not power on.', '2015-10-08 19:19:20', 1, NULL, 0),
(297, 76, 'Repaired', 30, 'Reinforced the battery compartment with a small piece of wood to keep the battery from falling into the scale.  Used cardboard to secured the battery in place and keep it from falling out since a replacement battery compartment cover could not be found.  Put a sticker over the bottom to close the compartment.  The scale is testing within tolerance and is now testing OK.  Ready to return to the customer.', '2015-10-08 13:20:43', 1, NULL, 0),
(298, 77, 'Pending', 0, 'Scale will not power on. 12.5v to board 4.5v to 6v battery. Battery is reading 2v.  Switch to power on is good.', '2015-10-09 01:15:09', 4, NULL, 0),
(299, 67, 'Delivered', 0, '10-8-15 Delivered by KR', '2015-10-09 17:42:53', 7, NULL, 0),
(300, 76, 'Delivered', 0, '10-8-15 Customer picked up.', '2015-10-09 17:51:03', 7, NULL, 0),
(301, 73, 'Delivered', 0, '10-8-15 Returned to customer by AP', '2015-10-09 17:53:56', 7, NULL, 0),
(302, 68, 'Delivered', 0, '10-8-15 Returned to customer by JK', '2015-10-09 17:54:28', 7, NULL, 0),
(303, 75, 'Repaired', 60, '10-8-15 Scale working correctly upon arrival for service call.  Keeping keypad in stock in case the scale fails again.', '2015-10-09 17:56:54', 7, NULL, 0),
(304, 75, 'Complete', 0, '-', '2015-10-09 17:57:16', 7, NULL, 0),
(305, 57, 'Repaired', 0, '-', '2015-10-19 13:25:19', 7, NULL, 0),
(306, 65, 'Replaced the Scale', 0, 'CUSTOMER PURCHASED A REPLACEMENT SCALE', '2015-10-19 13:25:54', 7, NULL, 0),
(307, 65, 'Replaced the Scale', 0, 'CUSTOMER PURCHASED REPLACEMENT SCALE', '2015-10-19 13:26:21', 7, NULL, 0),
(308, 66, 'Replaced the Scale', 0, 'CUSTOMER PURCHASED REPLACEMENT SCALE', '2015-10-19 13:28:49', 7, NULL, 0),
(309, 78, 'Pending', 0, 'The scale was brought in by the customer and they said that it was not weight correctly and the display was showing random numbers.  Have to unplug it to get it to reset.', '2015-10-21 00:48:28', 1, NULL, 0),
(310, 78, 'Diagnosed', 20, 'I was unable to duplicate the noted issue but found that the scale was weight incorrectly because the feet were too close to the bottom of the scale.  Lowered the feet to raise the scale further off of the ground and it is now reading right on to 500 lb.  Initially the display would flash dashes and 0.0 because once weight was applied the feet would rub and take the scale into underload.  It was also causing a decent weight fluctuation depending on where you were standing.  Adjusting the feet seems to have resolved the issue.  The scale is testing OK.', '2015-10-20 18:50:17', 1, NULL, 0),
(311, 57, 'Repaired', 25, 'Had to disassemble and resassemble the doran a few times to get the shift right.  Also had to add a foot to the scale since one had been broken off.  Calibrated the scale and the shift test now passes and the scale is testing within tolerance.  The scale is testing OK.', '2015-10-20 19:33:13', 1, NULL, 0),
(312, 79, 'Pending', 0, 'Scale is reading E-E-E.\nBrought back per Sean and Annette. Would like quote to fix.', '2015-10-21 01:58:06', 4, '2015-11-01 18:28:57', 13),
(313, 57, 'Delivered', 0, 'DELIVERED 10-21-15 DURING PI VISIT', '2015-10-21 18:48:17', 7, NULL, 0),
(314, 71, 'Delivered', 0, 'DELIVERED 10-21-15 DURING PI VISIT (WITH POWER SUPPLY)', '2015-10-21 18:49:00', 7, NULL, 0),
(315, 72, 'Delivered', 0, 'DELIVERED 10-21-15 DURING PI VISIT', '2015-10-21 18:49:23', 7, NULL, 0),
(316, 80, 'Pending', 0, 'Bobby brought the scale back to the shop since the display was showing all 8''s', '2015-10-21 17:19:16', 1, '2015-11-01 18:28:11', 13),
(317, 80, 'Repaired', 75, 'After inspection several of the pins on the screen were broken.  Soldered the pins back onto the screen secured connections reassembled the scale and then performed calibration and further testing.  The scale is now testing within tolerance and working correctly.  The scale is ready to be returned. \nParts used:\n2x feet from one of the 8571''s in the scale graveyard.', '2015-10-21 19:21:04', 1, '2015-11-01 18:26:52', 13),
(318, 79, 'Diagnosed', 60, 'The scale has a bad load cell but even with the simulator it is reading E E E.  Attempted calibration and the scale started reading E3.  Afterwards I could not get into the calibration menu.  Tried checking the ram modules with Sean but to no avail.  Probable bad mainboard as well.  Recommend scale replacement.', '2015-10-21 19:32:12', 1, NULL, 0),
(319, 81, 'Pending', 0, 'Replace power chord.', '2015-10-23 17:40:22', 4, NULL, 0),
(320, 82, 'Pending', 0, 'The scale is missing its pan and it seems that the keypad does not work.  The scale keeps cycling through a self test but weighs right on in weigh mode.', '2015-10-30 18:23:50', 1, '2015-11-01 18:24:08', 0),
(321, 83, 'Pending', 0, 'The scale will not power on.  Not sure what the actual scale divisions are.', '2015-10-30 18:27:04', 1, '2015-11-01 18:25:48', 0),
(322, 84, 'Pending', 0, 'The scale was brought back to the shop after the PI.  Not sure what the as found issue was.', '2015-10-30 18:29:28', 1, '2015-11-01 18:26:15', 0),
(323, 82, 'Diagnosed', 5, 'The scale has a bad keypad which causes the indicator to go into self test since its spamming commands.  Tested by removing the keypad and had no issues.  Also tested the mainboard by shorting pins to simulate the keypad and everything worked as it should.  Recommend new keypad for this indicator.', '2015-10-30 18:39:53', 1, NULL, 0),
(324, 83, 'Diagnosed', 20, 'There is good power coming into the scale and it is properly being converted to DC.  Both fuses are good and there is good DC output to the load cell as well as good mv coming back.  The screen will not come on.  Unable to determine the issue with the screen.  I could not get the mainboard to come free from the indicator itself.  Recommend scale replacement.', '2015-10-30 18:58:20', 1, NULL, 0),
(325, 84, 'Diagnosed', 45, 'Initially the keypad would not work or would just cause issues.  The indicator also had a weird magnet wire type of smell like something was burning.  Performed more testing and could not find a specific cause but was starting to think it was the option board.  After a while the screen stopped displaying anything but the power to the indicator was still good and I still had DC and mv output for the load cell.  The mainboard seems to have gone bad in this indicator.  Recommend indicator replacement.', '2015-10-30 19:44:46', 1, NULL, 0),
(326, 51, 'Delivered', 0, '-', '2015-10-30 20:52:50', 7, NULL, 0),
(327, 69, 'Waiting for Customer', 0, 'CUSTOMER HAS BEEN QUOTED A REPLACEMENT SCALE.', '2015-10-30 20:54:23', 7, NULL, 0),
(328, 78, 'Delivered', 0, 'CUSTOMER PICKED UP SCALE', '2015-10-30 20:55:17', 7, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE IF NOT EXISTS `feedback` (
`id` int(10) NOT NULL,
  `status` varchar(40) NOT NULL,
  `comments` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(10) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(6) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `status`, `comments`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Other', 'This is just a test comment.  Please feel free to leave more comments here.', '2015-10-24 18:43:38', 13, '2015-10-25 19:23:51', 13);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE IF NOT EXISTS `tickets` (
`id` int(10) NOT NULL,
  `companyname` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `city` varchar(30) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zipcode` int(8) NOT NULL,
  `indicator_tag` varchar(25) NOT NULL,
  `indicator_manu` varchar(25) NOT NULL,
  `indicator_model` varchar(25) NOT NULL,
  `indicator_serial` varchar(25) NOT NULL,
  `scale_manu` varchar(25) DEFAULT NULL,
  `scale_model` varchar(25) DEFAULT NULL,
  `scale_serial` varchar(25) DEFAULT NULL,
  `scale_capacity` int(10) DEFAULT NULL,
  `scale_divisions` float NOT NULL,
  `units` varchar(3) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(10) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(10) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `companyname`, `street`, `city`, `state`, `zipcode`, `indicator_tag`, `indicator_manu`, `indicator_model`, `indicator_serial`, `scale_manu`, `scale_model`, `scale_serial`, `scale_capacity`, `scale_divisions`, `units`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Hoff Vegetables', '123 Road Place', 'Fort Wayne', 'IN', 46815, 'N/A', 'Ohaus', 'DS10', 'N/A', 'Pennsylvania', '', '', 110, 0.05, 'lb', '2015-09-07 13:38:25', 13, '2015-09-26 14:30:57', 13),
(2, 'Hoff Vegetables', '123 Road Place', 'Fort Wayne', 'IN', 46815, 'N/A', 'Ohaus', 'DS10', 'N/A', 'Pennsylvania', '', '', 110, 0.05, 'lb', '2015-09-07 13:39:18', 13, '2015-09-26 14:30:57', 13),
(3, 'Hoff Vegetables', '123 Road Place', 'Fort Wayne', 'IN', 46815, 'N/A', 'Ohaus', 'DS10', 'N/A', 'Pennsylvania', '', '', 110, 0.05, 'lb', '2015-09-07 14:00:17', 13, '2015-09-26 14:30:57', 13),
(4, 'Hoff Vegetables', '123 Road Place', 'Fort Wayne', 'IN', 46815, 'N/A', 'Ohaus', 'DS10', 'N/A', 'Pennsylvania', NULL, NULL, 110, 0.05, 'lb', '2015-09-19 21:17:37', 13, '2015-09-26 14:30:57', 13);

-- --------------------------------------------------------

--
-- Table structure for table `tickets_import`
--

CREATE TABLE IF NOT EXISTS `tickets_import` (
`id` int(6) unsigned NOT NULL,
  `customer` char(40) NOT NULL,
  `street` char(40) DEFAULT NULL,
  `city` char(25) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `zipcode` char(8) DEFAULT NULL,
  `indicator_tag` char(25) NOT NULL,
  `indicator_manu` char(25) NOT NULL,
  `indicator_model` char(25) NOT NULL,
  `indicator_serial` char(25) NOT NULL,
  `scale_manu` char(25) DEFAULT NULL,
  `scale_model` char(25) DEFAULT NULL,
  `scale_serial` char(25) DEFAULT NULL,
  `scale_capacity` int(6) NOT NULL,
  `scale_divisions` float NOT NULL,
  `units` char(2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(6) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(6) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tickets_import`
--

INSERT INTO `tickets_import` (`id`, `customer`, `street`, `city`, `state`, `zipcode`, `indicator_tag`, `indicator_manu`, `indicator_model`, `indicator_serial`, `scale_manu`, `scale_model`, `scale_serial`, `scale_capacity`, `scale_divisions`, `units`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(10, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '22', 'Weigh Tronix', 'WI-125', '026462', NULL, NULL, NULL, 150, 0.01, 'lb', '2015-05-26 15:00:00', 3, NULL, 0),
(11, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '123', 'GSE', '460', '184981', NULL, NULL, NULL, 100, 0.01, 'lb', '2015-05-26 15:00:00', 3, NULL, 0),
(12, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '63', 'GSE', '460', '124982', NULL, NULL, NULL, 0, 0, 'lb', '2015-05-26 15:00:00', 3, NULL, 0),
(13, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '80', 'AND', 'FG-60KAL', 'EQ1930289', NULL, NULL, NULL, 150, 0.05, 'lb', '2015-05-26 15:00:00', 3, NULL, 0),
(14, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '64', 'AND', 'FG-60KAL', 'EQ1930182', NULL, NULL, NULL, 150, 0.05, 'lb', '2015-05-26 15:00:00', 3, NULL, 0),
(15, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '41', 'Weigh Tronix', 'WI-125', '026467', NULL, NULL, NULL, 0, 0, 'lb', '2015-05-26 15:00:00', 3, NULL, 0),
(16, 'Therma Tru', NULL, 'Butler', 'IN', NULL, '7118', 'Doran', '4100', 'N/A', 'Doran', 'DSP4150', '7118', 50, 0.02, 'lb', '2015-06-02 18:01:59', 1, NULL, 0),
(17, 'Erie Haven', NULL, NULL, 'IN', NULL, 'N/A', 'AND', 'FG-60K', 'H3801244', 'AND', NULL, NULL, 150, 0.05, 'lb', '2015-06-08 14:12:25', 1, NULL, 0),
(20, 'EXOS', '505 N State Road 9', 'Howe', 'IN', '46746', 'S003', 'Mettler Toledo', 'Viper SM 12', '2642697-7LE', NULL, NULL, NULL, 24, 0.002, 'lb', '2015-06-09 17:08:43', 1, NULL, 0),
(22, 'ENI LABS', '3120 INDEPENDENCE DRIVE', 'FORT WAYNE', 'IN', '46808', '638', 'RINSTRUM', 'N320', '6XSL6095-0080', NULL, NULL, NULL, 1000, 0.2, 'lb', '2015-06-10 19:46:05', 7, NULL, 0),
(27, 'BRC', NULL, 'Hartford City', 'IN', NULL, '56', 'Pennsylvania', '7500', '5S-001460', NULL, NULL, NULL, 50, 0.005, 'lb', '2015-06-15 10:52:09', 1, NULL, 0),
(28, 'Pretzels', '123 Harvest Road', 'Bluffton', 'IN', '46714', '125', 'Doran', '2200CW', '22C11481', 'Doran', 'DXL7010/88', '22C11481', 10, 0.002, 'lb', '2015-06-17 15:48:21', 1, NULL, 0),
(29, 'Press Seal Gasket', '2424 W State Blvd', 'Fort Wayne', 'IN', '46808', '10', 'Mettler Toledo', 'Wildcat', '00822026MD', 'Mettler Toledo', NULL, NULL, 150, 0.05, 'lb', '0000-00-00 00:00:00', 1, NULL, 0),
(30, 'Tyson', '1255 W Tyson Rd', 'Portland', 'IN', '47371', '16', 'Mettler Toledo', 'BBA 425 - 3 PM', '3044200 - 7JK', NULL, NULL, NULL, 3, 0.0002, 'kg', '2015-06-18 17:17:40', 5, NULL, 0),
(31, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '71', 'DORAN', '4300', '433392', NULL, NULL, NULL, 5, 0.001, 'lb', '2015-06-25 17:57:11', 4, NULL, 0),
(32, 'Pretzels', '123 Harvest RD', 'Bluffton', 'IN', '46714', '66', 'DORAN', '4300', '433407', NULL, NULL, NULL, 5, 0.0005, 'lb', '2015-06-25 18:08:43', 4, NULL, 0),
(33, 'Pretzels', '123 Harvest RD', 'Bluffton', 'IN', '46714', '124', 'DORAN', '2200CW', '22C11474', 'Doran', 'DXL7010/88', '22C11474', 10, 0.002, 'lb', '2015-06-25 18:13:36', 4, NULL, 0),
(36, 'kennametal', '1201 Eisenhower Dr north', 'Goshen', 'IN', '46526', '69', 'GSE', '464', '159453', NULL, NULL, NULL, 2000, 0.2, 'lb', '2015-06-26 18:50:57', 4, NULL, 0),
(38, 'Colwell General', '2605 Marion Dr', 'Kendallville', 'IN', '46755', 'New', 'Sartorius', 'Signum 3 SIWXSBBP-3-3-H', '32903158', NULL, NULL, NULL, 3100, 0.01, 'g', '2015-07-01 00:37:10', 1, NULL, 0),
(39, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '14', 'Weigh Tronix', 'QC3265', '006847', 'Weigh Tronix', 'BSN 99 6', '6847', 6, 0.002, 'lb', '2015-07-02 00:07:32', 1, NULL, 0),
(40, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '36', 'GSE', '460', '125995', 'General Electronic System', '4418', '806328R', 100, 0.01, 'lb', '2015-07-02 00:13:54', 1, NULL, 0),
(41, 'Tyson Foods', '1355 W TYSON ROAD', 'PORTLAND', 'IN', '47371', '6771', 'AND', 'EK4100i', '6A4401586', NULL, NULL, NULL, 4000, 0.1, 'g', '2015-07-02 01:57:51', 7, NULL, 0),
(42, 'Tyson Foods', '1255 W TYSON RD', 'Portland', 'IN', '47371', '105', 'AND', 'EK4100i', '6A4413430', NULL, NULL, NULL, 4000, 0.1, 'g', '2015-07-02 02:01:44', 1, NULL, 0),
(43, 'Armour Eckrich', '3311 State RD 19', 'Peru', 'IN', '46970', 'S68', 'GSE', '465', '160836', 'Ohaus', 'D25WR', '1649426-6JM', 50, 0.01, 'lb', '2015-07-10 01:55:30', 4, NULL, 0),
(44, 'Armour Eckrich', '3311 State RD 19', 'Peru', 'IN', '46970', 'S25', 'GSE', '465', '189380', 'Ohaus', 'D25WRUS', 'B452429289', 50, 0.01, 'lb', '2015-07-10 01:57:01', 4, NULL, 0),
(45, 'Shady Gove Farms Inc', '7580 E 150 N', 'Churubusco', 'IN', '46723', 'NA', 'REMO', 'Tree', '1107000118', 'Remo', 'Weighbar System', 'NA', 5000, 1, 'lb', '2015-07-14 00:43:06', 3, NULL, 0),
(46, 'City of Auburn', '2010 S Wayne St', 'Auburn', 'IN', '46706', '5', 'Sartorious', 'MA35', '0000115V1', 'See Above', 'See Above', 'See Above', 35, 0.001, 'g', '2015-07-15 01:49:57', 3, NULL, 0),
(47, 'Hoff Vegetables', NULL, NULL, 'IN', NULL, 'N/A', 'Ohaus', 'DS10', 'N/A', NULL, NULL, NULL, 110, 0.05, 'lb', '2015-07-24 20:55:56', 1, NULL, 0),
(48, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '80', 'AND', 'FG-60KAL', 'EQ1930289', NULL, NULL, NULL, 60, 0.02, 'lb', '2015-07-24 21:30:13', 1, NULL, 0),
(49, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', 'N/A', 'GSE', '450', '411439', NULL, NULL, NULL, 100, 0.1, 'lb', '2015-07-24 21:44:14', 1, NULL, 0),
(50, 'Energy Control', 'NA', 'Ossian', 'IN', NULL, 'ChemScale', 'GSE', '651', '201408', 'NA', 'NA', 'NA', 2000, 1, 'lb', '2015-07-31 17:27:33', 3, NULL, 0),
(51, 'Hanson Ag', '260 E 300 N', 'Angola', 'IN', '46703', '--', 'Matko', 'SBL2', '209469', NULL, NULL, NULL, 0, 0, 'lb', '2015-08-06 18:40:41', 8, NULL, 0),
(52, 'Tyson Foods inc', '1355 W Tyson Road', 'Portland', 'IN', '47371', '10', 'Mettler Toledo', 'PM3', '8558', 'Mettler Toledo', 'As above', 'NA', 3000, 0.002, 'g', '2015-08-13 17:47:13', 3, NULL, 0),
(53, 'American Mitsuba', '21600 Monroeville Rd', 'Monroeville', 'IN', '46773', '8', 'Setra', 'Quick Count', '2529645', 'Setra', 'Quick Count', '2529645', 27, 0.0005, 'lb', '2015-08-15 01:45:17', 1, NULL, 0),
(54, 'Tyson Foods', '1355 W Tyson Road', 'Portland', 'IN', '47371', '109', 'AND', 'EK4100i', 'N/A', NULL, NULL, NULL, 4000, 0.1, 'lb', '2015-08-25 01:38:33', 1, NULL, 0),
(55, 'Tyson Foods', '1355 W Tyson Road', 'Portland', 'IN', '47371', '108', 'AND', 'EK4100i', 'NA', NULL, NULL, NULL, 4000, 0.1, 'lb', '2015-08-25 01:40:08', 1, NULL, 0),
(56, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '57', 'Doran', '7000', '761823', NULL, NULL, NULL, 100, 0.02, 'lb', '2015-09-01 01:14:10', 1, NULL, 0),
(57, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '66', 'Doran', '4300', '433407', 'Doran', 'DXL7005', '433407', 5, 0.0005, 'lb', '2015-09-01 01:15:09', 1, NULL, 0),
(58, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '38', 'Weigh Tronix', 'WI-125', '027211', NULL, NULL, NULL, 100, 0.01, 'lb', '2015-09-01 01:16:23', 1, NULL, 0),
(59, 'Messenger', '318 E 7th St', 'Auburn', 'IN', '46706', '14', 'Pennsylvania', '7500', '98 253065', NULL, NULL, NULL, 50, 0.01, 'lb', '2015-09-09 01:05:29', 1, NULL, 0),
(60, 'Therma Tru', '601 RE Jones Rd', 'Butler', 'IN', '46721', '26', 'Ohaus', 'CS 5000', 'N/A', NULL, NULL, NULL, 5000, 1, 'g', '2015-09-12 16:02:32', 1, NULL, 0),
(61, 'CJ Automotive', '100 Commerce St', 'Butler', 'IN', '46721', '51-7518', 'Doran', '4200', '421466', 'NA', 'NA', 'NA', 50, 0.01, 'lb', '2015-09-12 16:10:10', 1, NULL, 0),
(62, 'Therma Tru', '601 RE Jones Rd', 'Butler', 'IN', '46721', '351-112', 'GSE', '351', '173112', NULL, NULL, NULL, 50, 0.01, 'lb', '2015-09-12 16:12:17', 1, NULL, 0),
(63, 'Therma Tru', '601 RE Jones Rd', 'Butler', 'IN', '46721', '1003', 'Weigh Tronix', 'QC3265', 'N/A', NULL, NULL, NULL, 100, 0.02, 'lb', '2015-09-12 16:13:01', 1, NULL, 0),
(64, 'Tyson', '1335 W Tyson Rd', 'Portland', 'IN', NULL, '75', 'AND', 'EK4100i', 'N/A', NULL, NULL, NULL, 4000, 0.1, 'g', '2015-09-15 01:54:08', 1, NULL, 0),
(65, 'Tyson', '1355 W Tyson Rd', 'Portland', 'IN', NULL, '109', 'AND', 'EK4100i', 'N/A', NULL, NULL, NULL, 4000, 0.1, 'g', '2015-09-15 01:57:18', 1, NULL, 0),
(66, 'Tyson', '1355 A Tyson Rd', 'Portland', 'IN', NULL, '105', 'AND', 'EK4100i', 'N/A', NULL, NULL, NULL, 4000, 0.1, 'lb', '2015-09-15 02:02:23', 1, NULL, 0),
(67, 'Rees Inc', '405 S Reed Rd', 'Fremont', 'IN', '46737', '6', 'Setra', '5000c/Quartz', 'N/A', NULL, NULL, NULL, 5000, 0.1, 'g', '2015-09-16 23:09:43', 1, NULL, 0),
(68, 'Real Alloy', '305 Dimension AVE', 'Wabash', 'IN', NULL, '7', 'Mettler Toledo', 'ab54', '1115432572', NULL, NULL, NULL, 51, 0.0001, 'g', '2015-09-17 01:05:26', 4, NULL, 0),
(69, 'Nishikawa Cooper LLC', '324 Morrow St', 'Topekia', 'IN', '46571', '1609', 'Doran', '4100', 'NA', 'NA', 'NA', 'NA', 50, 0.005, 'lb', '2015-09-24 17:53:24', 3, NULL, 0),
(70, 'Tyson Foods', '1335 W Tyson Rd', 'Portland', 'IN', NULL, '126', 'Doran 4300', '4300M', '4616898', NULL, NULL, NULL, 50, 0.1, 'lb', '2015-09-25 01:04:00', 2, NULL, 0),
(71, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '64', 'AND', 'FG-60KAL', 'EQ1930182', NULL, NULL, NULL, 150, 0.05, 'lb', '2015-09-30 02:23:51', 3, NULL, 0),
(72, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '53', 'Weigh Tronix', 'QC3265', 'NA', NULL, NULL, NULL, 6, 0.002, 'lb', '2015-09-30 02:24:38', 3, NULL, 0),
(73, 'Fox Products', '6110 South State Road 5', 'South Whitley', 'IN', '46787', '1', 'GSE', '675', '106017', NULL, NULL, NULL, 5, 0.002, 'lb', '2015-10-03 00:42:21', 2, NULL, 0),
(74, 'Trelleborg Sealing', '2531 Bremer Rd', 'Fort Wayne', 'IN', '46803', '128', 'Setra Super 2', '4091331NN', '5185458', NULL, NULL, NULL, 5, 0.02, 'kg', '2015-10-06 18:05:47', 2, NULL, 0),
(75, 'Pretzels', '123 Harvest Road', 'Bluffton', 'IN', '46714', '119', 'Doran', '4300', '43160007', 'Doran', '4300', '43160007', 5, 0.001, 'lb', '2015-10-07 20:42:24', 7, NULL, 0),
(76, 'ChickfilA', '1725 Apple Glen Blvd', 'Fort Wayne', 'IN', '46804', 'N/A', 'Edlund', 'DS-10', '220143', NULL, NULL, NULL, 5000, 2, 'g', '2015-10-08 19:19:20', 1, NULL, 0),
(77, 'Parker Hannifin', '303 Muesse Argonne', 'Hicksville', 'OH', '46773', '10', 'adam', 'ae', '0', 'adam', 'ae', '0', 16, 0.002, 'lb', '2015-10-09 01:15:09', 4, NULL, 0),
(78, 'St Anne Home', '1900 Randallia Dr', 'Fort Wayne', 'IN', '46805', '7', 'Rice Lake', 'H350-01-2', '120112C104592', NULL, NULL, NULL, 1000, 0.2, 'lb', '2015-10-21 00:48:28', 1, NULL, 0),
(79, 'Hartz Mountain corp', '40 E Industrial BLVD', 'Logansport', 'IN', '46947', '13', 'Mettler Toledo', 'SW', '5076622-5fa', NULL, NULL, NULL, 15, 0.002, 'lb', '2015-10-21 01:58:06', 4, NULL, 0),
(80, 'BRC', '1 Wall St', 'Ligonier', 'IN', '46767', '6', 'Toledo', '8571', '2549276-2PS', NULL, NULL, NULL, 100, 0.01, 'lb', '2015-10-22 01:19:16', 1, NULL, 0),
(81, 'Pretzels', '123 Harvest Rd', 'Bluffton', 'IN', '46714', '19', 'GSE', '460', '156523', NULL, NULL, NULL, 5000, 1, 'lb', '2015-10-23 17:40:22', 4, NULL, 0),
(82, 'Ardagh Glass', '1509 S Macedonia Ave', 'Muncie', 'IN', '47302', '26', 'Doran', '4300M', '4316915', NULL, NULL, NULL, 5, 0.001, 'lb', '2015-10-30 23:23:50', 1, NULL, 0),
(83, 'Armour Eckrich', '3311 IN19', 'Peru', 'IN', '46970', '994', 'Rice Lake', 'IQ+355-2A', '1706000010', NULL, NULL, NULL, 60, 0.01, 'lb', '2015-10-30 23:27:04', 1, NULL, 0),
(84, 'Armour Eckrich', '3311 IN19', 'Peru', 'IN', '46970', 'P31', 'Weigh Tronix', 'WI-125', 'N/A', NULL, NULL, NULL, 50, 0.01, 'lb', '2015-10-30 23:29:28', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(10) NOT NULL,
  `username` varchar(40) NOT NULL,
  `firstName` varchar(40) NOT NULL,
  `lastName` varchar(40) NOT NULL,
  `password` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'user',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_by` int(10) DEFAULT NULL,
  `updated_by` int(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `firstName`, `lastName`, `password`, `email`, `role`, `last_login`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'agillespie', 'Anthony', 'Gillespie', '$2a$10$bxsQgZKdkPbfmkdI.1iLy.wP7jCABA41SnvqPEGc63q72O0Uo9wy2', 'apickelheimer@bscales.com', 'admin', NULL, 4, 48, '2015-09-07 15:37:07', '2015-11-01 18:06:45'),
(2, 'krutledge', 'Kevin', 'Rutledge', '$2a$10$hD8ySEj57/Ey4VeVvo2CU.Q.A4ckYSxbVHOVmp/RSpiSqDr5CIx0a', 'krutledge@bscales.com', 'user', NULL, 13, 13, '2015-09-23 10:53:37', '2015-11-01 18:06:53'),
(3, 'dgraft', 'Dan', 'Graft', '$2a$10$d0sumnlAEGbpr7A9Ph8qt.TksAj9idrcyoqIJ7A5c4XEfBvUjjQrC', 'dgraft@bscales.com', 'user', NULL, 13, 13, '2015-10-11 17:39:29', '2015-11-01 18:06:57'),
(4, 'ccripe', 'Chris', 'Cripe', '$2a$10$ygZlbWKv.SSADiRWOr3zPeNB1j4UNHNBpFw6qJKkb6G7/CnT72mJ2', 'ccripe@bscales.com', 'user', NULL, 13, 13, '2015-10-11 17:45:08', '2015-11-01 18:07:00'),
(5, 'bduncan', 'Barry', 'Duncan', '$2a$10$gMvK2E.CylpycCmcNmnJ5e811ME1H2w5paT2eb1B.cDOPgqJJvjMK', 'bduncan@bscales.com', 'user', NULL, 13, 13, '2015-10-11 17:45:30', '2015-11-01 18:07:05'),
(6, 'bgoodman', 'Bobby', 'Goodman', '$2a$10$/IeU/5z268I29F5S4ut7Ze0zYmZTP6PeHaWxtb3oovECG/ZTnqlIG', 'bgoodman@bscales.com', 'mod', NULL, 13, 48, '2015-10-11 17:39:45', '2015-11-01 18:07:33'),
(7, 'ahenderson', 'Amy', 'Henderson', '$2a$10$mR4G7ktvm2.EOoTxT2H1r.sDQ/xdIJ91yuN4dQS8rQugOkSrg3Soi', 'ahenderson@bscales.com', 'mod', NULL, 13, 13, '2015-09-23 10:54:15', '2015-11-01 18:07:36'),
(8, 'Sbrazill', 'Sean', 'Brazill', '$2a$10$GR85tamVKychIurOGGG97uAKqtQEER0aBj8S3XQz70wvQr4J0eV2S', 'Sbrazill@bscales.com', 'mod', NULL, 13, 48, '2015-10-20 19:59:01', '2015-11-01 18:07:10'),
(9, 'bmusgrove', 'Bob', 'Musgrove', '$2a$10$e6qT9egpVY4LLqISNbZJg.rfYOKgTqKCifdgIsazuB7LNQF31SPZ.', 'bmusgrove@bscales.com', 'user', NULL, 13, 13, '2015-10-20 19:59:01', '2015-11-01 18:08:48'),
(10, 'jkonopacki', 'Justin', 'Konopacki', '$2a$10$nu2YkM5bR5ByJodKn/p7gORrrr0t4EZkcj2K3x4FhekcYgS4cZfH2', 'jkonopacki@bscales.com', 'user', NULL, 48, NULL, '2015-11-01 13:04:25', '2015-11-01 18:07:13'),
(11, 'mmckeever', 'Mark', 'McKeever', '$2a$10$aO9eZd419rTzMkUQiWZ1v.6Sca/DL1C3mDuQlpp2hxm6YTzbt6Bo6', 'msomething@bscales.com', 'user', NULL, 48, NULL, '2015-11-01 13:04:51', '2015-11-01 18:07:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets_import`
--
ALTER TABLE `tickets_import`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=329;
--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tickets_import`
--
ALTER TABLE `tickets_import`
MODIFY `id` int(6) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=85;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
